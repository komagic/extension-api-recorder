import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CopyTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import { JsonEditor } from 'json-edit-react';
function JsonCustomerEditor(props) {
  let parsed = {};
  try {
    parsed = JSON.parse(props.item);
  } catch (error) {}
  return (
    <div onClick={e => e.stopPropagation()}>
      <JsonEditor
        theme={'default'}
        icons={{
          copy: <CopyTwoTone />,
          edit: <EditTwoTone />,
          delete: <DeleteTwoTone />,
          add: <PlusCircleTwoTone />,
          ok: <CheckCircleTwoTone />,
          cancel: <CloseCircleTwoTone />,
        }}
        rootName="response "
        data={parsed}
        className="custom-json-editor"
        collapse={props.collapse || 0}
        setData={props.setData}
      />
    </div>
  );
}

export default JsonCustomerEditor;
