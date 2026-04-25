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
	    uso_por_hora: Record<number, number>;
	    uso_por_dia_semana: Record<string, number>;
	    uso_mensal: Record<string, number>;
	    periodo_inicio: string;
	    periodo_fim: string;
	
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
	        this.uso_por_hora = source["uso_por_hora"];
	        this.uso_por_dia_semana = source["uso_por_dia_semana"];
	        this.uso_mensal = source["uso_mensal"];
	        this.periodo_inicio = source["periodo_inicio"];
	        this.periodo_fim = source["periodo_fim"];
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

