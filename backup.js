// modified from Rio6's script so it saves and loads from file
// edited from original copy page so it only copies the fleets

// save a blob with given name https://stackoverflow.com/a/48968694/6023997
var saveFile = (data, filename) => {
    let blob = new Blob([data], { type: "application/octet-stream" })
    let url = URL.createObjectURL(blob)
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = filename
    a.target = "_blank"
    a.click()
    setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }, 0)
}
var loadFile = (file, cb) => {
    let reader = new FileReader()
    reader.onload = e => cb(e.target.result)
    reader.onerror = () => console.error("Aborted")
    reader.readAsText(file)
}

// Fleet screen draw hook
var copyPage = copyPage || {
    fleetUIHook: window.fleetUI
}
window.fleetUI = function () {
    if (!commander) return
    onecup.div(".hover-black", function () {
        onecup.margin(20)
        onecup.text_align("center")
        onecup.color("white")
        onecup.text("Load /")
        onecup.position("absolute")
        onecup.top(0)
        onecup.right(140)
        onecup.z_index("2")
        onecup.input("#fleet-file", { type: "file" }, () => {
            onecup.position("absolute")
            onecup.bottom(0)
            onecup.left(0)
            onecup.opacity("0")
        })
        onecup.onchange(() => {
            let fileChooser = onecup.lookup("#fleet-file")
            if (fileChooser) { //from Rio6 game recorder
                let file = fileChooser.files[0]
                if (file) {
                    loadFile(file, json => {
                        try {
                            let data = JSON.parse(json)
                            window.commander.fleet = data
                            account.rootSave()
                        } catch (e) {
                            console.log(e)
                        }
                    })
                }
            }
        })
    })
    onecup.div(".hover-black", function () {
        onecup.margin(20)
        onecup.text_align("center")
        onecup.color("white")
        onecup.text("Save fleet")
        onecup.position("absolute")
        onecup.top(0)
        onecup.right(64)
        onecup.z_index("2")
        return onecup.onclick(() => saveFile(JSON.stringify(commander.fleet), `${commander.name}_${new Date().toLocaleString().replace(/\s+/g, '_')}.json`))
    })
    return copyPage.fleetUIHook.call(this)
}
