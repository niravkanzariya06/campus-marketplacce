
const MessageBubble = ({
  isOwn,
  text,
  timestamp,
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className={`flex flex-col ${isOwn ? 'self-end' : 'self-start'} max-w-[95%] gap-1`}>
      {/* Received message */}
      {!isOwn && (
        <div className="flex items-center gap-2">
          {/* Message bubble */}
          <div className="bg-surface-container-highest/80 backdrop-blur-md px-3 py-2 rounded-xl rounded-bl-none border border-white/5 shadow-md">
            <p className="text-xs md:text-sm text-on-surface leading-relaxed wrapped-break-words">{text}</p>
          </div>
        </div>
      )}



      {/* Sent message */}
      {isOwn && (
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-end gap-2 justify-end">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md px-3 py-2 rounded-xl rounded-br-none border border-white/5 shadow-lg">
              <p className="text-xs md:text-sm text-on-primary font-medium leading-relaxed break-words">{text}</p>
            </div>
            {/* Alignment placeholder (invisible) */}
            <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/30 invisible flex-shrink-0"></div>
          </div>

          {/* Timestamp with checkmark */}
          {timestamp && (
            <div className="flex items-center gap-1 text-[10px] text-on-surface-variant font-medium">
              {formatTime(timestamp)}
            </div>
          )}
        </div>
      )}

      {/* Received message timestamp */}
      {!isOwn && timestamp && (
        <span className="text-[10px] text-on-surface-variant font-medium ml-2">{formatTime(timestamp)}</span>
      )}
    </div>
  );
};

export default MessageBubble;
