// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {syncs} from '../models';

export function Auth(arg1:string):Promise<syncs.AuthResult>;

export function DownloadFile(arg1:string):Promise<syncs.Result>;

export function GetAuthURL():Promise<string>;

export function GetMetadata(arg1:string):Promise<syncs.MetadataResult>;

export function GetTemporaryLink(arg1:string):Promise<syncs.Result>;

export function IsAuthenticated():Promise<boolean>;

export function UploadFile(arg1:syncs.UploadArgs):Promise<syncs.UploadResult>;

export function UploadRawFile(arg1:string):Promise<syncs.Result>;