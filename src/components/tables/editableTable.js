
/**
 * EditableTable
 * columns 同antd的Table, 添加editable、editableElement、toggleEdit属性，
    * editable设为true，默认为input框
    * editableElement定制可编辑元素: (value, record, index, save, form) => ()
      * 坑：自定义组件需要自己onChange时 form.setFieldsValue({dataIndex: val}) 再调用 save(val)
    * toggleEdit -true表示未选中时不是input状态； false的话始终为input状态
    * rules: 可编辑元素校验规则
 * dataSource 同Table
 * handleSave 保存行的方法
 */
import React from 'react';
import {
  Table,
  Form,
  Input,
  message,
} from 'antd';
import './table.less';
import _ from 'lodash';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const resetFlg = [];

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

// const mapStateToProps = (state) => ({
// })

// const dispatchToProps =  {
//   setForms: (form, i) => setForms(form, i),
// }
// @connect(mapStateToProps, dispatchToProps)
class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  componentWillMount() {
    if (this.props.index !== undefined) {
      resetFlg[this.props.index] = true;
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input && this.input.focus();
      }
    });
  }

  save = (val) => {
    const {
      record, handleSave, dataIndex, toggleEdit
    } = this.props;
    this.form.validateFields((error, values) => { // [ dataIndex ],
      if (error) {
        // if(error.hasOwnProperty(dataIndex)) this.form.resetFields([ dataIndex ])
        handleSave({ ...record, error }, this.props.index);
      } else {
        values = this.form.getFieldsValue();
        handleSave({ ...record, ...values, error: null }, this.props.index);
      }
      toggleEdit && this.toggleEdit();
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      length,
      index,
      rules,
      handleSave,
      editableElement,
      toggleEdit,
      ...restProps
    } = this.props;
    const alwaysEditing = typeof (toggleEdit) === 'boolean' ? (!toggleEdit) : false;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              // if(!record.hasOwnProperty('nativeForm')){
              if (resetFlg[index] && editable) {
                resetFlg[index] = false;
                const nativeForm = form;
                handleSave({ nativeForm }, index, 'saveForms');
              }
              return (
                (alwaysEditing || editing || index === (length - 1)) ? (
                  <FormItem style={{ margin: 0, width: '100%', overflow: 'hidden' }}>
                    { form.getFieldDecorator(dataIndex, {
                      rules: rules && (_.isArray(rules) ? rules : rules(record)),
                      validateFirst: true,
                      initialValue: record[dataIndex] || undefined,
                    })(
                      editableElement ? editableElement(
                        record[dataIndex], record, index, this.save, this.form
                      ) : (
                        <Input
                          ref={node => (this.input = node)}
                          onBlur={this.save}
                          style={{ display: 'block', width: '100%' }}
                        />
                      )
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.forms = [];
  }

    handleSave = (row, rowIndex, type) => {
      const { dataSource } = this.props;
      const newData = [...dataSource];
      if (type = 'saveForms') {
        this.forms[rowIndex] = row;
        const resData = newData.map((item, index) => ({
          ...item,
          ...this.forms[index]
        }));
        this.props.handleSave(resData, row, rowIndex,);
        return;
      }
      const item = newData[rowIndex];
      newData.splice(rowIndex, 1, {
        ...item,
        ...row,
      });
      this.props.handleSave(newData, row, rowIndex,);
    }

    render() {
      const {
        dataSource, columns, loading, ...restProps
      } = this.props;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };

      const shownColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record, index) => ({
            record,
            index,
            length: dataSource.length,
            editable: col.editable,
            editableElement: col.editableElement,
            dataIndex: col.dataIndex,
            title: col.title,
            rules: col.rules,
            handleSave: this.handleSave,
            toggleEdit: col.toggleEdit,
          }),
        };
      });
      return (
        <div>
          <Table
            {...restProps}
            className={`editable-table ${this.props.className}`}
            components={components}
            rowClassName={() => 'editable-row'}
            dataSource={dataSource}
            columns={shownColumns}
            pagination={false}
            loading={loading}
          />
        </div>
      );
    }
}

export default EditableTable;
