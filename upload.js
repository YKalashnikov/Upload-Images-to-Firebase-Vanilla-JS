function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

function noop() {}

export function upload(selector, options = {}) {
    let files = []

    const onUpload = function(){
       if(!options.onUpload) {
           return noop
       }
    }
    const input = document.querySelector(selector)
    const preview = element('div', ['preview'])
    const open = element('button', ['btn'], 'Open')
    const upload = element('button', ['btn', 'primary'], 'Upload')
    upload.style.display = 'none'

    if (options.multiple) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }
    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);

    function triggerInput() {
        input.click()
    }

    function changeHandler(e) {
        if (!e.target.files.length) {
            return
        }

        files = Array.from(e.target.files)
        preview.innerHTML = ''

        upload.style.display = 'inline'

        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }
            const reader = new FileReader()

            reader.onload = e => {
                const src = e.target.result

                preview.insertAdjacentHTML('afterbegin',
                    `<div class="preview-image">
                    <div class="preview-remove" data-name="${file.name}">&times;</div>
                    <div class="preview-info">
                    <span>
                    ${file.name}
                    ${bytesToSize(file.size)}
                    </span></div>
            <img src="${src}" alt="${file.name}"></img>
            </div>`)
            }
            reader.readAsDataURL(file)
        })
    }
    const removeHandler = (e) => {
        if (!e.target.dataset) {
            return
        }
        const {
            name
        } = e.target.dataset
        files = files.filter(file => file.name !== name)
        if (!files.length) {
            upload.style.display = 'none'
        }
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')
        block.classList.add('removing')
        setTimeout(() => {
            block.remove()
        }, 300)
    }


    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info');
        previewInfo.forEach(clearPreview)
        onUpload(files)
    }
    open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)

}