export namespace syncs {
	
	export class AuthResult {
	    err?: any;
	
	    static createFrom(source: any = {}) {
	        return new AuthResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.err = source["err"];
	    }
	}
	export class MetadataResult {
	    contentHash?: string;
	    rev?: string;
	    err?: any;
	
	    static createFrom(source: any = {}) {
	        return new MetadataResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contentHash = source["contentHash"];
	        this.rev = source["rev"];
	        this.err = source["err"];
	    }
	}
	export class Result {
	    content?: any;
	    contentHash?: string;
	    rev?: string;
	    err?: any;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.content = source["content"];
	        this.contentHash = source["contentHash"];
	        this.rev = source["rev"];
	        this.err = source["err"];
	    }
	}
	export class UploadArgs {
	    fileName: string;
	    contentHash: string;
	    rev: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new UploadArgs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fileName = source["fileName"];
	        this.contentHash = source["contentHash"];
	        this.rev = source["rev"];
	        this.content = source["content"];
	    }
	}
	export class UploadResult {
	    contentHash?: string;
	    rev?: string;
	    err?: any;
	
	    static createFrom(source: any = {}) {
	        return new UploadResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contentHash = source["contentHash"];
	        this.rev = source["rev"];
	        this.err = source["err"];
	    }
	}

}

