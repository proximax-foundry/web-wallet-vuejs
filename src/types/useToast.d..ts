
declare global{
    function useToast() :ToastServiceMethods
    interface ToastServiceMethods {

        add: (message: ToastMessageOptions) => void;
        removeGroup: (group: string) => void;
        
        removeAllGroups: () => void;
    }
    
    interface ToastMessageOptions {
        /**
         * Severity level of the message.
         * @see ToastMessageSeverityType
         * Default value is 'info'.
         */
        severity?: any | undefined;
        /**
         * Summary content of the message.
         */
        summary?: string | undefined;
        /**
         * Detail content of the message.
         */
        detail?: any | undefined;
    
        detail2?: any | undefined;
        detail3?: any | undefined;
        detail4?: any | undefined;
    
        url?: any | undefined
        /**
         * Whether the message can be closed manually using the close icon.
         * Default value is true.
         */
        closable?: boolean | undefined;
        /**
         * Delay in milliseconds to close the message automatically.
         * Default value is 3000.
         */
        life?: number | undefined;
        /**
         * Key of the Toast to display the message.
         */
        group?: string | undefined;
        /**
         * Style class of the message.
         */
        styleClass?: any;
        /**
         * Style class of the content.
         */
        contentStyleClass?: any;
    }

}

export { useToast }

 


