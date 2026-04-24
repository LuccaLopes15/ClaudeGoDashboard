export namespace models {
	
	export class DashboardData {
	    total_sessoes: number;
	    total_interacoes: number;
	    projetos_ativos: number;
	    uso_por_projeto: Record<string, number>;
	
	    static createFrom(source: any = {}) {
	        return new DashboardData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total_sessoes = source["total_sessoes"];
	        this.total_interacoes = source["total_interacoes"];
	        this.projetos_ativos = source["projetos_ativos"];
	        this.uso_por_projeto = source["uso_por_projeto"];
	    }
	}

}

