// Sistema de edición inline para METATONEHEN
// Permite la edición directa de cualquier elemento de la página

document.addEventListener('DOMContentLoaded', function() {
    // Sólo inicializa el editor si estamos en modo edición
    if (!document.body.classList.contains('edit-mode')) {
        return;
    }
    
    // Overlay para indicar que estamos en modo edición
    const editOverlay = document.createElement('div');
    editOverlay.className = 'edit-mode-overlay';
    editOverlay.innerHTML = `
        <div class="edit-toolbar">
            <button id="save-changes-btn" class="edit-btn save-btn">Guardar Cambios</button>
            <button id="cancel-edit-btn" class="edit-btn cancel-btn">Cancelar</button>
            <button id="upload-image-btn" class="edit-btn">Subir Imagen</button>
            <a href="/exit-edit-mode" class="edit-btn exit-btn">Salir del Editor</a>
            <div class="edit-status">Modo de Edición Activado - Haz clic en cualquier texto o imagen para editarla directamente</div>
        </div>
        <div id="img-upload-panel" class="img-upload-panel">
            <div class="img-upload-header">
                <h3>Subir Nueva Imagen</h3>
                <span class="close-upload">&times;</span>
            </div>
            <form id="img-upload-form">
                <div class="form-group">
                    <label for="image-file">Seleccionar Imagen</label>
                    <input type="file" id="image-file" name="file" accept="image/*">
                </div>
                <div class="form-group">
                    <label for="image-description">Descripción</label>
                    <input type="text" id="image-description" name="description">
                </div>
                <button type="submit" class="edit-btn">Subir</button>
            </form>
            <div class="upload-preview">
                <h4>Vista Previa</h4>
                <div id="upload-preview-container"></div>
            </div>
        </div>
    `;
    document.body.appendChild(editOverlay);
    
    // Variables para rastrear cambios
    let changedElements = [];
    let removedElements = [];
    let addedElements = [];
    
    // Hacer todos los elementos de texto editables
    const editableTypes = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 'span', 'div', 'li', 'a',
        'button', 'figcaption'
    ];
    
    // Seleccionar todos los elementos de texto que no sean formularios o elementos del editor
    editableTypes.forEach(type => {
        document.querySelectorAll(type).forEach(element => {
            // No hacer editables los elementos del editor o que ya sean editables
            if (element.closest('.edit-mode-overlay') || 
                element.getAttribute('contenteditable') === 'true' ||
                element.closest('form') ||
                element.closest('script') ||
                element.closest('nav') && !element.closest('nav').classList.contains('editable-nav')) {
                return;
            }
            
            // Hacer el elemento editable
            element.setAttribute('contenteditable', 'true');
            element.classList.add('editable-element');
            
            // Guardar estado original para poder revertir cambios
            element.dataset.originalContent = element.innerHTML;
            
            // Añadir eventos para seguimiento de cambios
            element.addEventListener('input', function() {
                if (!changedElements.includes(element)) {
                    changedElements.push(element);
                }
                
                // Marcar el elemento como editado
                element.classList.add('element-edited');
            });
            
            // Agregar interface para eliminar el elemento
            element.addEventListener('mouseenter', function(e) {
                if (!document.querySelector('.element-controls[data-for="' + getElementId(element) + '"]')) {
                    addElementControls(element);
                }
            });
        });
    });
    
    // Hacer las imágenes reemplazables
    document.querySelectorAll('img').forEach(img => {
        // No aplicar a imágenes del editor o elementos decorativos
        if (img.closest('.edit-mode-overlay') || 
            img.classList.contains('decoration') ||
            img.closest('.editor-controls')) {
            return;
        }
        
        // Guardar estado original
        img.dataset.originalSrc = img.src;
        
        // Añadir clase para indicar que es reemplazable
        img.classList.add('editable-image');
        
        // Agregar controles al pasar el mouse
        img.addEventListener('mouseenter', function(e) {
            if (!document.querySelector('.img-controls[data-for="' + getElementId(img) + '"]')) {
                addImageControls(img);
            }
        });
    });
    
    // Habilitar arrastrar y soltar imágenes
    document.querySelectorAll('.image-drop-area').forEach(dropArea => {
        setupImageDropArea(dropArea);
    });
    
    // Función para generar IDs únicos para los elementos
    function getElementId(el) {
        if (!el.id) {
            el.id = 'editable-' + Math.random().toString(36).substr(2, 9);
        }
        return el.id;
    }
    
    // Agregar controles de edición para elementos
    function addElementControls(element) {
        const controls = document.createElement('div');
        controls.className = 'element-controls';
        controls.setAttribute('data-for', getElementId(element));
        controls.innerHTML = `
            <button class="control-btn delete-btn" title="Eliminar Elemento">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
            <button class="control-btn duplicate-btn" title="Duplicar Elemento">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </button>
        `;
        
        element.parentNode.insertBefore(controls, element);
        positionControls(controls, element);
        
        // Posicionar controles al hacer scroll
        window.addEventListener('scroll', function() {
            if (controls.parentNode) {
                positionControls(controls, element);
            }
        });
        
        // Eliminar elemento
        controls.querySelector('.delete-btn').addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
                removedElements.push({
                    element: element,
                    parent: element.parentNode,
                    nextSibling: element.nextSibling
                });
                element.classList.add('element-deleted');
                element.style.display = 'none';
                controls.remove();
            }
        });
        
        // Duplicar elemento
        controls.querySelector('.duplicate-btn').addEventListener('click', function() {
            const clone = element.cloneNode(true);
            clone.classList.add('element-added');
            addedElements.push(clone);
            element.parentNode.insertBefore(clone, element.nextSibling);
            clone.setAttribute('contenteditable', 'true');
            clone.classList.add('editable-element');
            clone.addEventListener('mouseenter', function(e) {
                if (!document.querySelector('.element-controls[data-for="' + getElementId(clone) + '"]')) {
                    addElementControls(clone);
                }
            });
        });
        
        // Eliminar controles al alejar el mouse
        element.addEventListener('mouseleave', function(e) {
            if (!controls.contains(e.relatedTarget) && !element.contains(e.relatedTarget)) {
                setTimeout(() => {
                    if (controls.parentNode && !controls.matches(':hover')) {
                        controls.remove();
                    }
                }, 500);
            }
        });
        
        controls.addEventListener('mouseleave', function(e) {
            if (!element.contains(e.relatedTarget)) {
                setTimeout(() => {
                    if (controls.parentNode && !element.matches(':hover')) {
                        controls.remove();
                    }
                }, 500);
            }
        });
    }
    
    // Agregar controles para imágenes
    function addImageControls(img) {
        const controls = document.createElement('div');
        controls.className = 'img-controls';
        controls.setAttribute('data-for', getElementId(img));
        controls.innerHTML = `
            <button class="control-btn replace-btn" title="Reemplazar Imagen">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
            </button>
            <button class="control-btn delete-img-btn" title="Eliminar Imagen">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        `;
        
        img.parentNode.insertBefore(controls, img);
        positionControls(controls, img);
        
        // Posicionar controles al hacer scroll
        window.addEventListener('scroll', function() {
            if (controls.parentNode) {
                positionControls(controls, img);
            }
        });
        
        // Reemplazar imagen
        controls.querySelector('.replace-btn').addEventListener('click', function() {
            const uploadPanel = document.getElementById('img-upload-panel');
            uploadPanel.classList.add('active');
            uploadPanel.dataset.targetImg = getElementId(img);
        });
        
        // Eliminar imagen
        controls.querySelector('.delete-img-btn').addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
                removedElements.push({
                    element: img,
                    parent: img.parentNode,
                    nextSibling: img.nextSibling
                });
                img.classList.add('element-deleted');
                img.style.display = 'none';
                controls.remove();
            }
        });
        
        // Eliminar controles al alejar el mouse
        img.addEventListener('mouseleave', function(e) {
            if (!controls.contains(e.relatedTarget) && !img.contains(e.relatedTarget)) {
                setTimeout(() => {
                    if (controls.parentNode && !controls.matches(':hover')) {
                        controls.remove();
                    }
                }, 500);
            }
        });
        
        controls.addEventListener('mouseleave', function(e) {
            if (!img.contains(e.relatedTarget)) {
                setTimeout(() => {
                    if (controls.parentNode && !img.matches(':hover')) {
                        controls.remove();
                    }
                }, 500);
            }
        });
    }
    
    // Posicionar controles respecto al elemento
    function positionControls(controls, element) {
        const rect = element.getBoundingClientRect();
        controls.style.top = (window.scrollY + rect.top - 30) + 'px';
        controls.style.left = (window.scrollX + rect.left) + 'px';
    }
    
    // Configurar áreas donde se pueden soltar imágenes
    function setupImageDropArea(dropArea) {
        dropArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropArea.classList.add('drag-over');
        });
        
        dropArea.addEventListener('dragleave', function() {
            dropArea.classList.remove('drag-over');
        });
        
        dropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            dropArea.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.match('image.*')) {
                    uploadImage(file, '', function(imageUrl) {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.classList.add('editable-image', 'element-added');
                        img.classList.add('img-fluid');
                        dropArea.appendChild(img);
                        addedElements.push(img);
                        
                        img.addEventListener('mouseenter', function() {
                            if (!document.querySelector('.img-controls[data-for="' + getElementId(img) + '"]')) {
                                addImageControls(img);
                            }
                        });
                    });
                }
            }
        });
        
        // Agregar botón para añadir imagen
        const addButton = document.createElement('button');
        addButton.className = 'add-image-btn';
        addButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Añadir Imagen</span>
        `;
        dropArea.appendChild(addButton);
        
        addButton.addEventListener('click', function() {
            const uploadPanel = document.getElementById('img-upload-panel');
            uploadPanel.classList.add('active');
            uploadPanel.dataset.targetArea = getElementId(dropArea);
        });
    }
    
    // Botón para subir imagen
    document.getElementById('upload-image-btn').addEventListener('click', function() {
        const uploadPanel = document.getElementById('img-upload-panel');
        uploadPanel.classList.add('active');
    });
    
    // Cerrar panel de subida de imágenes
    document.querySelector('.close-upload').addEventListener('click', function() {
        document.getElementById('img-upload-panel').classList.remove('active');
    });
    
    // Previsualizar imagen antes de subir
    document.getElementById('image-file').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewContainer = document.getElementById('upload-preview-container');
                previewContainer.innerHTML = `<img src="${e.target.result}" class="upload-preview-img">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Manejar formulario de subida de imágenes
    document.getElementById('img-upload-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('image-file');
        const description = document.getElementById('image-description').value;
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            uploadImage(file, description, function(imageUrl) {
                const uploadPanel = document.getElementById('img-upload-panel');
                
                // Si hay una imagen objetivo, reemplazar
                if (uploadPanel.dataset.targetImg) {
                    const targetImg = document.getElementById(uploadPanel.dataset.targetImg);
                    if (targetImg) {
                        targetImg.src = imageUrl;
                        targetImg.classList.add('element-edited');
                        changedElements.push(targetImg);
                    }
                } 
                // Si hay un área objetivo, añadir a esa área
                else if (uploadPanel.dataset.targetArea) {
                    const targetArea = document.getElementById(uploadPanel.dataset.targetArea);
                    if (targetArea) {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.classList.add('editable-image', 'element-added', 'img-fluid');
                        targetArea.appendChild(img);
                        addedElements.push(img);
                        
                        img.addEventListener('mouseenter', function() {
                            if (!document.querySelector('.img-controls[data-for="' + getElementId(img) + '"]')) {
                                addImageControls(img);
                            }
                        });
                    }
                }
                // Si no hay objetivo, agregar al final del contenido principal
                else {
                    const mainContent = document.querySelector('main') || document.querySelector('.container') || document.body;
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = description;
                    img.classList.add('editable-image', 'element-added', 'img-fluid', 'mx-auto', 'd-block', 'my-4');
                    mainContent.appendChild(img);
                    addedElements.push(img);
                    
                    img.addEventListener('mouseenter', function() {
                        if (!document.querySelector('.img-controls[data-for="' + getElementId(img) + '"]')) {
                            addImageControls(img);
                        }
                    });
                }
                
                // Limpiar y cerrar el panel
                fileInput.value = '';
                document.getElementById('image-description').value = '';
                document.getElementById('upload-preview-container').innerHTML = '';
                uploadPanel.classList.remove('active');
                delete uploadPanel.dataset.targetImg;
                delete uploadPanel.dataset.targetArea;
            });
        }
    });
    
    // Función para subir imagen al servidor
    function uploadImage(file, description, callback) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        
        fetch('/admin/media/upload_ajax', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                callback(data.file_path);
            } else {
                alert('Error al subir la imagen: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al subir la imagen. Por favor, intenta nuevamente.');
        });
    }
    
    // Guardar cambios
    document.getElementById('save-changes-btn').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres guardar todos los cambios realizados?')) {
            // Recopilar todos los cambios
            const changes = {
                pageUrl: window.location.pathname,
                changedElements: changedElements.map(el => ({
                    id: el.id,
                    type: el.tagName.toLowerCase(),
                    content: el.innerHTML,
                    src: el.tagName.toLowerCase() === 'img' ? el.src : null
                })),
                removedIds: removedElements.map(item => item.element.id),
                addedElements: addedElements.map(el => ({
                    parentId: el.parentNode.id,
                    parentSelector: getSelectorPath(el.parentNode),
                    position: Array.from(el.parentNode.children).indexOf(el),
                    type: el.tagName.toLowerCase(),
                    content: el.innerHTML,
                    src: el.tagName.toLowerCase() === 'img' ? el.src : null,
                    classes: Array.from(el.classList).filter(c => !['editable-element', 'editable-image', 'element-added'].includes(c))
                }))
            };
            
            // Enviar cambios al servidor
            fetch('/admin/save_inline_edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changes)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cambios guardados exitosamente');
                    window.location.reload();
                } else {
                    alert('Error al guardar los cambios: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
            });
        }
    });
    
    // Obtener selector CSS para un elemento
    function getSelectorPath(element) {
        if (element.id) {
            return '#' + element.id;
        }
        
        let path = [];
        let parent;
        
        while (element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            
            if (element.id) {
                selector += '#' + element.id;
                path.unshift(selector);
                break;
            } else {
                let sibling = element;
                let nth = 1;
                
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.nodeName.toLowerCase() === selector) nth++;
                }
                
                if (nth !== 1) selector += ':nth-of-type(' + nth + ')';
            }
            
            path.unshift(selector);
            element = element.parentNode;
        }
        
        return path.join(' > ');
    }
    
    // Cancelar edición
    document.getElementById('cancel-edit-btn').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres cancelar todos los cambios realizados?')) {
            window.location.reload();
        }
    });
});