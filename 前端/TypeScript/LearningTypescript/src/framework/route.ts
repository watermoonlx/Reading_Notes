class Route implements IRoute{
    public controllerName: string;
    public actionName: string;
    public args: Object[];

    constructor(
        controllerName: string,
        actionName: string,
        args:Object[]
    ){
        this.controllerName = controllerName;
        this.actionName = actionName;
        this.args = args;
    }

    public serialize(): string{
        let sargs = this.args.map(i => i.toString()).join('/');
        let s = `${this.controllerName}/${this.actionName}/${sargs}`;
        return s;
    }
}

export { Route };
