/**
 * my best friend <3 @itsmingjie wrote this for me
 * thank you mingjie i will be grateful forever
 * 
 * @author: @itsmingjie
 */

import NextLink from "next/link";

export const Link = ({
  href,
  children,
  external,
  ...props
}) => {
  return (
    // stylistic wrapper
    <span {...props}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <NextLink href={href}>{children}</NextLink>
      )}
    </span>
  );
};
