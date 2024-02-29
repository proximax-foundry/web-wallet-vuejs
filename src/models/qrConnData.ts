enum AppRequestType{
    Challenge = "requestChallenge",
    TxnPayload = "requestTxnPayload"
}

enum ConnType{
    Login = "login",
    SignTxn = "signTxn",
    SignData = "signData"
}

interface IConnQrData{
    connId: string,
    type: ConnType,
    generationHash: string,
    origin: string
}

interface ISignTxnResponse{
    readonly txnHash: string,
	readonly signedPayload: string
}

interface ISignDataResponse{
    readonly signature: string,
    readonly publicKey: string
}

interface ILoginResponse extends ISignDataResponse{
    readonly apiUrl: string
}

export {
    ConnType,
    AppRequestType,
    IConnQrData,
    ILoginResponse,
    ISignDataResponse,
    ISignTxnResponse
}