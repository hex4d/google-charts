let _instance

class GoogleChartsManager {
    get instance() {
        return _instance
    }

    set instance(value) {
        _instance = value
    }

    constructor() {
        if (this.instance) {
            return this.instance
        }

        this.instance = this
    }

    reset() {
        _instance = null
    }

    loadScript() {
        if (!this.scriptPromise) {
            this.scriptPromise = new Promise(function(resolve) {
                const body = document.getElementsByTagName('body')[0]
                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.onload = function() {
                    GoogleCharts.api = window.google
                    GoogleCharts.api.charts.load('current', {
                        packages: ['corechart', 'table'],
                    })
                    GoogleCharts.api.charts.setOnLoadCallback(function() {
                        resolve()
                    })
                }
                script.src = 'https://www.gstatic.com/charts/loader.js'
                body.appendChild(script)
            })
        }
        return this.scriptPromise
    }

    load(callback, type) {
        return this.loadScript().then(function() {
            if (type) {
                let config = {}
                if (type instanceof Object) {
                    config = type
                } else if (Array.isArray(type)) {
                    config = { packages: type }
                } else {
                    config = { packages: [type] }
                }
                this.api.charts.load('current', config)
                this.api.charts.setOnLoadCallback(callback)
            } else {
                if(typeof callback != 'function') {
                    throw('callback must be a function');
                } else {
                    callback()               
                }
            }
        })
    }
}

export const GoogleCharts = new GoogleChartsManager()
export default GoogleChartsManager
