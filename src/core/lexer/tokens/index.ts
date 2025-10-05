// Import all token families - New Modular Organization
import { WhiteSpace, NewLine, BlankLine, Colon, Identifier } from './core.tokens';
import { Screen, Modal, Drawer } from './views.tokens';
import { Button, Link, Image, Heading, Text, Paragraph, MutedText, Note, Quote } from './primitives.tokens';
import { Row, Col, Grid, Container } from './layouts.tokens';
import { List, Card, Header, Navigator, UnorderedListItem, FAB, Separator } from './structures.tokens';
import { Input, RadioOption, Checkbox } from './inputs.tokens';
import { Component, ComponentInstance, ComponentInstanceWithProps, PropVariable } from './components.tokens';
import { Styles, CssProperty } from './styles.tokens';

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
  
  // Primitives
  Button,
  Link,
  Image,
  Heading,
  Text,
  Paragraph,
  MutedText,
  Note,
  Quote,
  
  // Layouts
  Row,
  Col,
  Grid,
  Container,
  
  // Structures
  List,
  Card,
  Header,
  Navigator,
  UnorderedListItem,
  FAB,
  Separator,
  
  // Inputs
  Input,
  RadioOption,
  Checkbox,
  
  // Components
  Component,
  ComponentInstance,
  ComponentInstanceWithProps,
  PropVariable,
  
  // Styles
  Styles,
  CssProperty
};

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
  ComponentInstanceWithProps, // Must come before ComponentInstance for correct matching
  ComponentInstance,
  PropVariable,
  FAB,
  Input,
  Button,
  Link,
  Image,
  Heading,
  MutedText,
  Paragraph,
  Text,
  Note,
  Quote,
  Row,
  Col,
  Grid,
  Container,
  List,
  Card,
  Header,
  Navigator,
  UnorderedListItem,
  Separator,
  RadioOption,
  Checkbox,
  Colon,
  Identifier
];