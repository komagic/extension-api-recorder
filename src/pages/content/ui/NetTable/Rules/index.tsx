import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Flex, Input, Popconfirm, Popover, Tag, Tooltip } from 'antd';
import BaseBtn from '../BaseBtn';
import { ACTIONS, useStore } from '../../Context/useStore';
import { DEFAULT_RULES, Z_INDEX_MAIN } from '@root/src/constant';

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};


const CTag = ({ children, ...rest }) => <Tag {...rest}>{children}</Tag>;

const RuleGroups: React.FC = () => {
  const { state, dispatch } = useStore();
  const tags = state.rules;
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const setTags = newTags => {
    dispatch({
      type: ACTIONS.UPDATE_RULES,
      payload: newTags,
    });
  };

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const handleRecover = () => {
    dispatch({
      type: ACTIONS.UPDATE_RULES,
      payload: DEFAULT_RULES,
    });
  };

  return (
    <Flex gap="4px 0" wrap align="end">
      {tags.map<React.ReactNode>((tag, index) => {
         const key = `tag-${index}`;  
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={key}
              size="small"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <CTag key={tag} closable color="magenta" style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
            <span
              onDoubleClick={e => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </CTag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Popover
          style={{
            zIndex: Z_INDEX_MAIN,
          }}
          content={
            <div className="flex flex-col gap-2">
              <div className="text-base" style={{ color: '#fff' }}>
                匹配规则
              </div>
              <span>包括：/api、.json</span>
              <span>正则：/api/、/campus/</span>
            </div>
          }>
          <BaseBtn icon={<PlusOutlined />} onClick={showInput}>
            录入规则
          </BaseBtn>
        </Popover>
      )}
      <Popconfirm title="确认回复默认匹配规则吗？" onConfirm={handleRecover} okText={'确认'} cancelText={'取消'}>
        <BaseBtn toolTip={'恢复默认'} style={{ marginLeft: 4 }} placement="bottom" icon={<ReloadOutlined />}></BaseBtn>
      </Popconfirm>
    </Flex>
  );
};

export default RuleGroups;
