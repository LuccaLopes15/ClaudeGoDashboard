export namespace models {
	
	export class RepoRankingItem {
	    nome: string;
	    qtd: number;
	
	    static createFrom(source: any = {}) {
	        return new RepoRankingItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.nome = source["nome"];
	        this.qtd = source["qtd"];
	    }
	}
	export class DashboardData {
	    total_sessoes: number;
	    total_interacoes: number;
	    projetos_ativos: number;
	    uso_por_projeto: Record<string, number>;
	    top_repositorios: RepoRankingItem[];
	
	    static createFrom(source: any = {}) {
	        return new DashboardData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total_sessoes = source["total_sessoes"];
	        this.total_interacoes = source["total_interacoes"];
	        this.projetos_ativos = source["projetos_ativos"];
	        this.uso_por_projeto = source["uso_por_projeto"];
	        this.top_repositorios = this.convertValues(source["top_repositorios"], RepoRankingItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

