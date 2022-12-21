import { Avatar, Box, Tooltip } from "@chakra-ui/react"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';

import { useEffect, useRef } from 'react';
const ScrollableChat = ({ messages, isTyping }) => {

  const { user } = ChatState();
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  },[messages,isTyping]);
  return (
    <>
      <Box>
        {messages &&
          messages.map((m, i) => (
            <Box ref={scrollRef} style={{ display: "flex" }} key={m._id+i}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                    loading="lazy"
                  />
                </Tooltip>
              )}
              <span
                style={{
                  background: `${
                    m.sender._id === user._id
                      ? "linear-gradient( 150.6deg,  rgba(96,221,142,1) 11.2%, rgba(24,138,141,1) 91.1% )"
                      : "radial-gradient( circle 369px at 10% 20%,rgba(245,76,76,0.80) 0.7%, rgba(243,203,129,0.9) 86.1% )"
                  }`,
                  color: "whitesmoke",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "50%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i) ? 3 : 10,
                }}
              >
                {m?.content}
              </span>
            </Box>
          ))}
      </Box>
    </>
  );
}
export default ScrollableChat