import { ClientSuggestion } from "src/entities/client_suggestion.entity";

export class ClientSuggestionToEntity{
    nom_client: string;
    
    tel_client: string;

    email_client: string;

    suggestion: string;
}

export class ClientSuggestionFromEntity{
    id: string;

    nom_client: string;
    
    tel_client: string;

    email_client: string;

    suggestion: string;

    constructor(ClientSuggestion: ClientSuggestion){
        this.nom_client = ClientSuggestion.nom_client;
        this.id = ClientSuggestion.id;
        this.tel_client = ClientSuggestion.tel_client;
        this.email_client = ClientSuggestion.email_client;
        this.suggestion = ClientSuggestion.suggestion;
    }
}