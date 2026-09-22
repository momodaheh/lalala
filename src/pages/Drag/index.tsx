import { IconAIEditLevel1 } from '@douyinfe/semi-icons';
import { Chat } from '@douyinfe/semi-ui';
import { useCallback, useMemo, useRef, useState } from 'react';

const defaultMessage = [
  {
    role: 'assistant',
    id: '1',
    createAt: 1715676751919,
    content:
      'Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统，你可以向我提问任何关于 Semi 的问题。',
  },
];

const hintsExample = [
  '告诉我更多',
  'Semi Design 的组件有哪些？',
  '我能够通过 DSM 定制自己的主题吗？',
];

const roleInfo = {
  user: {
    name: 'User',
    avatar:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png',
  },
  assistant: {
    name: 'Assistant',
    avatar:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
  },
  system: {
    name: 'System',
    avatar:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png',
  },
};

const commonOuterStyle = {
  border: '1px solid var(--semi-color-border)',
  borderRadius: '16px',
  height: 400,
};

let id = 0;
function getId() {
  return `id-${id++}`;
}
const uploadProps = { action: 'https://api.semi.design/upload' };

function DefaultChat() {
  const [message, setMessage] = useState(defaultMessage);
  const [hints, setHints] = useState(hintsExample);
  const testRef = useRef(null);

  const onHintClick = useCallback(() => {
    console.log('onHintClick');
    setHints([]);
  }, []);

  const onMessageSend = useCallback((_content, _attachment) => {
    const newAssistantMessage = {
      role: 'assistant',
      id: getId(),
      createAt: Date.now(),
      content: '这是一条 mock 回复信息',
    };
    setTimeout(() => {
      setMessage((message) => [...message, newAssistantMessage]);
    }, 200);
    setHints([]);
  }, []);

  const onChatsChange = useCallback((chats) => {
    setMessage(chats);
  }, []);

  const commonHintStyle = useMemo(
    () => ({
      border: '1px solid var(--semi-color-border)',
      padding: '10px',
      borderRadius: '10px',
      color: 'var( --semi-color-text-1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '14px',
    }),
    [],
  );

  const renderHintBox = useCallback((props) => {
    const { content, onHintClick, index } = props;
    return (
      <div style={commonHintStyle} onClick={onHintClick} key={index}>
        {content}
        <IconAIEditLevel1 style={{ marginLeft: 10 }}>click me</IconAIEditLevel1>
      </div>
    );
  }, []);

  const onClear = useCallback(() => {
    setHints([]);
  }, []);

  return (
    <>
      <Chat
        renderHintBox={renderHintBox}
        hints={hints}
        onHintClick={onHintClick}
        style={commonOuterStyle}
        chats={message}
        roleConfig={roleInfo}
        onChatsChange={onChatsChange}
        onMessageSend={onMessageSend}
        onClear={onClear}
        uploadProps={uploadProps}
        onInputChange={() => {
          console.log(testRef.current);
        }}
      />
      <div>
        <span ref={testRef}>123123</span>
      </div>
    </>
  );
}

export default DefaultChat;
