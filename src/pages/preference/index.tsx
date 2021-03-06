import * as React from 'react';
import * as styles from './index.scss';
import UserList from './userList/index';
import ImageHosting from './imageHosting';
import {
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncSetDefaultPluginId,
} from 'pageActions/userPreference';
import { bindActionCreators, Dispatch } from 'redux';
import { CenterContainer } from 'components/container';
import { connect, routerRedux } from 'dva';
import { List, Select, Switch, Tabs, Icon } from 'antd';
import { ExtensionType, SerializedExtensionWithId } from 'extensions/interface';
import { GlobalStore } from '@/common/types';

const TabPane = Tabs.TabPane;

const useActions = {
  push: routerRedux.push,
  asyncSetEditorLiveRendering: asyncSetEditorLiveRendering.started,
  asyncSetShowLineNumber: asyncSetShowLineNumber.started,
  asyncSetDefaultPluginId: asyncSetDefaultPluginId.started,
};

const mapStateToProps = ({
  userPreference: {
    remoteVersion,
    accounts,
    liveRendering,
    showLineNumber,
    defaultPluginId,
    extensions,
  },
}: GlobalStore) => {
  return {
    remoteVersion,
    showLineNumber,
    defaultPluginId,
    closeQRCode: true,
    containToken: true,
    liveRendering,
    QRCodeContent: '',
    accounts,
    extensions: extensions.filter(o => o.type !== ExtensionType.Tool),
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageProps = PageStateProps & PageDispatchProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(useActions, dispatch);

class Page extends React.Component<PageProps> {
  handleClose = () => {
    this.props.push('/');
  };

  render() {
    const { defaultPluginId, extensions } = this.props;
    return (
      <CenterContainer>
        <div className={styles.mainContent}>
          <div onClick={this.handleClose} className={styles.closeIcon}>
            <Icon type="close" />
          </div>
          <div style={{ background: 'white', height: '100%' }}>
            <Tabs defaultActiveKey="base" tabPosition="left" style={{ height: '100%' }}>
              <TabPane tab="账户设置" key="base" className={styles.tabPane}>
                <UserList />
              </TabPane>
              <TabPane tab="图床设置" key="imageHost" className={styles.tabPane}>
                <ImageHosting />
              </TabPane>
              <TabPane tab="工具设置" key="tool" className={styles.tabPane}>
                <List.Item
                  actions={[
                    <Select
                      key="selectDefaultPlugin"
                      allowClear
                      value={defaultPluginId ? defaultPluginId : -1}
                      style={{ width: '100px' }}
                      onSelect={(value: any) => {
                        let selectValue = null;
                        if (value !== -1) {
                          selectValue = value;
                        }
                        this.props.asyncSetDefaultPluginId({
                          pluginId: selectValue,
                        });
                      }}
                    >
                      <Select.Option value={-1}>无</Select.Option>
                      {(extensions as SerializedExtensionWithId[]).map(o => (
                        <Select.Option key={o.id}>{o.manifest.name}</Select.Option>
                      ))}
                    </Select>,
                  ]}
                >
                  <List.Item.Meta title="默认插件" description="开启剪藏后使用的默认插件" />
                </List.Item>
              </TabPane>
              <TabPane tab="编辑器设置" key="editor" className={styles.tabPane}>
                <List.Item
                  actions={[
                    <Switch
                      checked={this.props.showLineNumber}
                      onChange={() => {
                        this.props.asyncSetShowLineNumber({
                          value: this.props.showLineNumber,
                        });
                      }}
                      key="showLineNumber"
                    />,
                  ]}
                >
                  <List.Item.Meta title="显示行号" description="显示编辑器右侧的行号" />
                </List.Item>
                <List.Item
                  actions={[
                    <Switch
                      key="liveRendering"
                      checked={this.props.liveRendering}
                      onChange={() => {
                        this.props.asyncSetEditorLiveRendering({
                          value: this.props.liveRendering,
                        });
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta title="实时预览" description="是否开启实时预览" />
                </List.Item>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </CenterContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
