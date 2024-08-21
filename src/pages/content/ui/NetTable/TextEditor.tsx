import { Input } from 'antd';
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import BaseBtn from './BaseBtn';
import { Z_INDEX_MAIN } from '@root/src/constant';
import type { TextAreaProps } from 'antd/es/input';
interface TextEditorProps extends TextAreaProps {
  value?: string;
  submit?: (val: string) => void;
}

const TextEditor: React.FC<TextEditorProps<HTMLTextAreaElement>> = ({ value, submit, ...rest }, ref) => {
  // 初始状态
  const initialContent = value;

  // 设置三个状态：文本内容、撤销按钮状态、提交按钮状态
  const [content, setContent] = useState(initialContent);
  const [previousContent, setPreviousContent] = useState(initialContent);
  const [isChanged, setIsChanged] = useState(false);
  let the_error = null;
  // 当文本内容改变时，检测是否与初始内容不同
  useEffect(() => {
    if (content !== initialContent) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [content, initialContent]);

  // 处理文本框内容变化
  const handleTextChange = e => {
    setContent(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    setContent,
    getContent: () => {
      return content;
    },
  }));

  // 撤销操作，恢复到之前的状态
  const handleUndo = () => {
    setContent(previousContent);
    setIsChanged(false);
  };

  // 提交操作，更新初始内容
  const handleSubmit = () => {
    setPreviousContent(content);
    submit?.(content);
    setIsChanged(false);
  };

  let input = content;
  try {
    const parsed = JSON.parse(input);
    if (parsed && Object.prototype.toString.call(parsed) === '[object Object]') {
      input = JSON.stringify(parsed, null, 4);
      the_error = null;
    }
  } catch (error) {
    the_error = error;
    console.error(the_error);
  }
  console.log('TextEditor', input);
  return (
    <div className="relative">
      <Input.TextArea minLength={3} value={input} onChange={handleTextChange} {...rest} />
      {the_error && <div className="absolute top-0 right-0 text-red-500">不是合法的json</div>}
      <div
        className=" top-0 right-[12px] mt-[4px]"
        style={{
          zIndex: Z_INDEX_MAIN + 1,
          display: isChanged ? 'block' : 'none',
          textAlign: 'right',
        }}>
        <BaseBtn
          toolTip="取消修改"
          onClick={handleUndo}
          disabled={!isChanged}
          type="text"
          danger
          icon={<CloseOutlined />}
        />
        <BaseBtn
          style={{ color: 'green' }}
          onClick={handleSubmit}
          disabled={!isChanged}
          toolTip="确认修改"
          type="text"
          icon={<CheckOutlined />}
        />
      </div>
    </div>
  );
};

export default forwardRef(TextEditor);
