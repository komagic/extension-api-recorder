import { CopyOutlined } from '@ant-design/icons';
import { JsonEditor } from 'json-edit-react';

function JsonCustomEditor(props) {
  return <JsonEditor theme={'githubDark'} collapse={1} {...props} />;
}

export default JsonCustomEditor;
