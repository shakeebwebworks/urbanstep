// A Bootstrap button with a click "ripple" effect. Use as={Link} to make a link-button.
export default function Button({ as: Tag = 'button', className = '', onClick, children, ...rest }) {
  const handleClick = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText =
      `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    if (onClick) onClick(e);
  };
  const typeProp = Tag === 'button' && !rest.type ? { type: 'button' } : {};
  return (
    <Tag className={`btn ${className}`} onClick={handleClick} {...typeProp} {...rest}>
      {children}
    </Tag>
  );
}