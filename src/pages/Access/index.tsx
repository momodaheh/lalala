import { PageContainer } from '@ant-design/pro-components';
import { IconAIEditLevel1 } from '@douyinfe/semi-icons';
import { Chat, FloatButton, MarkdownRender, Button } from '@douyinfe/semi-ui';
import './style.less';

const AccessPage: React.FC = () => {
  const defaultMessage = [
    {
      role: 'system',
      id: '1',
      createAt: 1715676751919,
      content: "Hello, I'm your AI assistant.",
    },
    {
      role: 'user',
      id: '2',
      createAt: 1715676751919,
      content: '给一个 Semi Design 的 Button 组件的使用示例',
    },
    {
      role: 'assistant',
      id: '3',
      createAt: 1715676751919,
      content:
        "以下是一个 Semi 代码的使用示例：\n```jsx \nimport React from 'react';\nimport { Button } from '@douyinfe/semi-ui';\n\nconst MyComponent = () => {\n  return (\n    <Button>Click me</Button>\n );\n};\nexport default MyComponent;\n```\n",
    },
  ];

  const obj = {
    label: '选项1',
  }
  return (
    <PageContainer
      ghost
      header={{
        title: '权限示例',
      }}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Chat
        chats={defaultMessage}
        style={{ height: 600 }}
        className="testStyle"
      />
      <FloatButton icon={<IconAIEditLevel1 />} style={{ bottom: '270px' }} />
      <MarkdownRender
        raw={`
#### 下面是一个渲染在 Markdown 中的按钮
<MyButton onClick={()=>alert("点击了 MyButton")} obj={${JSON.stringify(obj)}}>MyButton 点我</MyButton>

直接在 Markdown 中书写 JSX 即可
        `}
        components={{
          ...MarkdownRender.defaultComponents,
          ...{
            MyButton: ({ children: _children, onClick, obj }) => {
              console.log(obj);
              return (
                <Button
                  type={'primary'}
                  onClick={onClick}
                  style={{ marginBottom: '12px' }}
                >
                  {obj.label}
                </Button>
              );
            },
          },
        }}
      />
    </PageContainer>
  );
};

export default AccessPage;
