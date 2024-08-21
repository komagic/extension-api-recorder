import { Input } from 'antd';
import React, { ChangeEventHandler, useState } from 'react';
import {
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import BaseBtn from './BaseBtn';
interface TextEditorProps<T> {
  value?: string;
  onChange?: ChangeEventHandler<T>
}
 
const TextEditor: React.FC<TextEditorProps<HTMLTextAreaElement>> = ({value,onChange}) => {
    const [isEditing,setIsEditing] = useState(false);
    let input = value;
    try {
        const parsed= JSON.parse(value);  
        if(parsed && typeof parsed ==='object'){
            input = JSON.stringify(parsed, null, 4);
        }   
    } catch (error) {
        console.error(error);
    }
    return (<>
       <BaseBtn toolTip="撤销修改" type="text" disabled={!isEditing} danger icon={<CloseOutlined />} />
              <BaseBtn toolTip="确认修改" type="text" disabled={!isEditing} icon={<CheckOutlined />} />
    <Input.TextArea value={input} onChange={onChange}/>
    
    </> );
}
 
export default TextEditor;