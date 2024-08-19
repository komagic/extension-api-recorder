import { Input } from 'antd';
import React, { ChangeEventHandler } from 'react';

interface TextEditorProps<T> {
  value?: string;
  onChange?: ChangeEventHandler<T>
}
 
const TextEditor: React.FC<TextEditorProps<HTMLTextAreaElement>> = ({value,onChange}) => {
    let input = value;
    try {
        const parsed= JSON.parse(value);  
        if(parsed && typeof parsed ==='object'){
            input = JSON.stringify(parsed, null, 4);
        }   
    } catch (error) {
        console.error(error);
    }
    return ( <Input.TextArea value={input} onChange={onChange}/> );
}
 
export default TextEditor;