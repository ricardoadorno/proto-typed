// Import all token families - New Modular Organization
import {
  WhiteSpace,
  NewLine,
  BlankLine,
  Colon,
  Identifier,
} from './core.tokens'
import { Screen, Modal, Drawer } from './views.tokens'
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonGhost,
  ButtonDestructive,
  ButtonLink,
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeXs,
  ButtonSizeSm,
  ButtonSizeMd,
  ButtonSizeLg,
  ButtonLabel,
  ButtonAction,
  Link,
  Image,
  Heading,
  Text,
  Paragraph,
  MutedText,
  Note,
  Quote,
} from './primitives.tokens'
import {
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container,
  Stack,
  StackTight,
  StackLoose,
  StackFlush,
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,
  Col,
  Grid2,
  Grid3,
  Grid4,
  GridAuto,
  Card,
  CardCompact,
  CardFeature,
  Header,
  Sidebar,
  List,
  Navigator,
  UnorderedListItem,
  Fab,
  Separator,
} from './layouts.tokens'
import { Input, RadioOption, Checkbox } from './inputs.tokens'
import { Component, ComponentInstance, PropVariable } from './components.tokens'
import { Styles, CssProperty } from './styles.tokens'

// Export all tokens - Organized by Category
export {
  // Core Language
  WhiteSpace,
  NewLine,
  BlankLine,
  Colon,
  Identifier,

  // Views
  Screen,
  Modal,
  Drawer,

  // Primitives - Buttons
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonGhost,
  ButtonDestructive,
  ButtonLink,
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeXs,
  ButtonSizeSm,
  ButtonSizeMd,
  ButtonSizeLg,
  ButtonLabel,
  ButtonAction,

  // Primitives - Other
  Link,
  Image,
  Heading,
  Text,
  Paragraph,
  MutedText,
  Note,
  Quote,

  // Layouts - Containers
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container,

  // Layouts - Stacks
  Stack,
  StackTight,
  StackLoose,
  StackFlush,

  // Layouts - Rows
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,
  Col,

  // Layouts - Grids
  Grid2,
  Grid3,
  Grid4,
  GridAuto,

  // Layouts - Cards
  Card,
  CardCompact,
  CardFeature,

  // Layouts - Special
  Header,
  Sidebar,

  // Layouts - Structural Elements
  List,
  Navigator,
  UnorderedListItem,
  Fab,
  Separator,

  // Inputs
  Input,
  RadioOption,
  Checkbox,

  // Components
  Component,
  ComponentInstance,
  PropVariable,

  // Styles
  Styles,
  CssProperty,
}

// All tokens array - order matters for matching precedence
export const allTokens = [
  NewLine,
  WhiteSpace,
  // Styles tokens must come early for proper matching
  Styles,
  CssProperty,
  Screen,
  Component,
  Modal,
  Drawer,
  ComponentInstance,
  PropVariable,
  Fab,
  // Input tokens - RadioOption and Checkbox must come BEFORE Input for correct matching
  RadioOption,
  Checkbox,
  Input,
  // Button tokens - specific variants before general marker
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonGhost,
  ButtonDestructive,
  ButtonLink,
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker, // Must come after all specific variants
  ButtonSizeXs,
  ButtonSizeSm,
  ButtonSizeMd,
  ButtonSizeLg,
  ButtonLabel,
  ButtonAction,
  Link,
  Image,
  Heading,
  MutedText,
  Paragraph,
  Text,
  Note,
  Quote,
  // Canonical layout tokens
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container, // After specific container patterns
  StackTight, // More specific patterns first
  StackLoose,
  StackFlush,
  Stack,
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,
  Col,
  Grid2,
  Grid3,
  Grid4,
  GridAuto,
  CardCompact, // More specific patterns first
  CardFeature,
  Card,
  Header,
  Sidebar,
  List,
  Navigator,
  UnorderedListItem, // Must come after other tokens to avoid conflicts
  Separator,
  Colon,
  Identifier,
]
