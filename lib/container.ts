export class AppContainer {
    
    _services;
    _singletons;
    _scopedSingletons;
    
    constructor(services?, singletons?) {
        this._services = services ? services : new Map();
        this._singletons = singletons ? singletons : new Map();
        this._scopedSingletons = new Map();
    }

    register(name, definition, dependencies?) {
        this._services.set(name, {definition: definition, dependencies: dependencies})
    }

    singleton(name, definition, dependencies?) {
        this._services.set(name, {definition: definition, dependencies: dependencies, singleton:true})
    }

    scoped(name, definition, dependencies?) {
        this._services.set(name, {definition: definition, dependencies: dependencies, scoped:true})
    }

    value(name, definition, dependencies?) {
        this._services.set(name, {definition: definition, dependencies: dependencies, value:true})
    }

    get(name) { 
        const c = this._services.get(name)
        if(this._isClass(c.definition)) {

            if(c.singleton) {
                const singletonInstance = this._singletons.get(name)
                if(singletonInstance) {
                    return singletonInstance
                } else {
                    const newSingletonInstance = this._createInstance(c)
                    this._singletons.set(name, newSingletonInstance)
                    return newSingletonInstance
                }
            }

            if(c.scoped){
                const scopedSingletonInstance = this._scopedSingletons.get(name)
                if(scopedSingletonInstance) {
                    return scopedSingletonInstance
                } else {
                    const newScopedSingletonInstance = this._createInstance(c)
                    this._scopedSingletons.set(name, newScopedSingletonInstance)
                    return newScopedSingletonInstance
                } 
            }

            return this._createInstance(c)

        } else {
            return c.definition //always the same object or primitive
        }
    }

    _getResolvedDependencies(service) {
        let classDependencies = []
        if(service.dependencies) {
            classDependencies = service.dependencies.map((dep) => {
                return this.get(dep)
            })
        }
        return classDependencies
    }

    _createInstance(service) {
        return new service.definition(...this._getResolvedDependencies(service))
    }

    _isClass(definition) {
        return typeof definition === 'function'
    }

    getScopedContainer(): AppContainer {
        return new AppContainer(this._services, this._singletons);
    }

}