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
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeSmall,
  ButtonSizeIcon,
  ButtonSizeLarge,
  ButtonLabel,
  ButtonAction,
  Image,
  Heading,
  Note,
  Blockquote,
  MutedText,
  SmallText,
  Paragraph,
} from './primitives.tokens'
import {
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container,
  Stack,
  StackTight,
  StackLoose,
  StackNone,
  Row,
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,
  Grid,
  Grid2,
  Grid3,
  Grid4,
  GridResponsive,
  LayerStatic,
  LayerRelative,
  LayerAbsolute,
  LayerFixed,
  LayerSticky,
  LayerOverlay,
  ScrollAuto,
  ScrollX,
  ScrollY,
  ScrollHidden,
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
import {
  Head,
  HeadColor,
  HeadFont,
  HeadTemplate,
  ColorPrimary,
  ColorSecondary,
  ColorNeutral,
  ColorAccent,
  FontBase,
  FontFamily,
  TemplateDefault,
  PropertyValue,
} from './head.tokens'
import { Meta, MetaVersion, MetaTitle, MetaValue } from './meta.tokens'

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
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeSmall,
  ButtonSizeIcon,
  ButtonSizeLarge,
  ButtonLabel,
  ButtonAction,

  // Primitives - Other
  Image,
  Heading,
  Paragraph,
  SmallText,
  MutedText,
  Blockquote,
  Note,

  // Layouts - Containers
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container,

  // Layouts - Stacks
  Stack,
  StackTight,
  StackLoose,
  StackNone,

  // Layouts - Rows
  Row,
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,

  // Layouts - Grids
  Grid,
  Grid2,
  Grid3,
  Grid4,
  GridResponsive,

  // Layouts - Layer / Position
  LayerStatic,
  LayerRelative,
  LayerAbsolute,
  LayerFixed,
  LayerSticky,
  LayerOverlay,

  // Layouts - Overflow
  ScrollAuto,
  ScrollX,
  ScrollY,
  ScrollHidden,

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

  // Head (formerly Styles)
  Head,
  HeadColor,
  HeadFont,
  HeadTemplate,
  ColorPrimary,
  ColorSecondary,
  ColorNeutral,
  ColorAccent,
  FontBase,
  FontFamily,
  TemplateDefault,
  PropertyValue,

  // Meta
  Meta,
  MetaVersion,
  MetaTitle,
  MetaValue,
}

// All tokens array - order matters for matching precedence
export const allTokens = [
  NewLine,
  WhiteSpace,
  // Head tokens must come early for proper matching
  Head,
  HeadColor,
  HeadFont,
  HeadTemplate,
  ColorPrimary,
  ColorSecondary,
  ColorNeutral,
  ColorAccent,
  FontBase,
  FontFamily,
  TemplateDefault,
  // Meta tokens - keywords come early, MetaValue comes later
  Meta,
  MetaVersion,
  MetaTitle,
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
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker, // Must come after all specific variants
  ButtonSizeSmall,
  ButtonSizeIcon,
  ButtonSizeLarge,
  ButtonLabel,
  ButtonAction,
  Image,
  Heading,
  Paragraph,
  SmallText,
  MutedText,
  Blockquote,
  Note,
  // Canonical layout tokens
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container, // After specific container patterns
  StackTight, // More specific patterns first
  StackLoose,
  StackNone,
  Stack,
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,
  Row,
  Grid2,
  Grid3,
  Grid4,
  GridResponsive,
  Grid,
  LayerOverlay,
  LayerSticky,
  LayerFixed,
  LayerAbsolute,
  LayerRelative,
  LayerStatic,
  ScrollX,
  ScrollY,
  ScrollAuto,
  ScrollHidden,
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
  PropertyValue, // Must come AFTER Identifier to avoid capturing component names
  MetaValue, // Must come AFTER all keywords to avoid capturing them
]
