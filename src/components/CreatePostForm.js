import React from 'react';
import { Form, Input, Upload, Icon } from 'antd';
const FormItem = Form.Item;

class CreatePostForm extends React.Component {

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return(<Form layout="vertical">
            <FormItem
                {...formItemLayout}
                label="Message"
            >
                {getFieldDecorator('message', {
                    rules: [{ required: true, message: 'Please input the title of collection!' }],
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="Image"
            >
                <div className="dropbox">
                    {getFieldDecorator('image', {
                        rules: [{ required: true, message: 'Please choose an image' }],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                    })(
                        <Upload.Dragger
                            name="files"
                            beforeUpload={this.beforeUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Upload.Dragger>
                    )}
                </div>
            </FormItem>
        </Form>
        );
    }
}

export const WrappedCreatePostForm = Form.create()(CreatePostForm);