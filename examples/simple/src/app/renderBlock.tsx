import {Box, Heading, Stack, Text} from '@sanity/ui'
import {PTBlock} from 'pte'
import React, {createElement} from 'react'

export function renderBlock(
  node: PTBlock,
  props: React.PropsWithoutRef<Record<string, unknown>>,
  children: React.ReactNode
) {
  if (node.name === 'ul') {
    return (
      <Stack as="ul" {...props} marginY={[3, 4, 5]} space={[3, 4, 4]}>
        {children}
      </Stack>
    )
  }

  if (node.name === 'ol') {
    return (
      <Stack as="ol" {...props} marginY={[3, 4, 5]} space={[3, 4, 4]}>
        {children}
      </Stack>
    )
  }

  if (node.name === 'h1') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h1" size={[2, 3, 4]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'h2') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h2" size={[1, 2, 3]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'h3') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h3" size={[0, 1, 2]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'h4') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h4" size={[0, 0, 1]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'h5') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h5" size={[0, 0, 0]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'h6') {
    return (
      <Box {...props} marginY={[4, 5, 6]}>
        <Heading as="h6" muted size={[0, 0, 0]}>
          {children}
        </Heading>
      </Box>
    )
  }

  if (node.name === 'p') {
    return (
      <Box {...props} marginY={[3, 4, 5]}>
        <Text as="p">{children}</Text>
      </Box>
    )
  }

  if (node.name === 'li') {
    return (
      <Text as="li" {...props}>
        {children}
      </Text>
    )
  }

  return createElement(node.name, props, children)
}
