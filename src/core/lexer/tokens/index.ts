// Import all token families
import { WhiteSpace, NewLine, BlankLine } from './whitespace.tokens';
import { Screen, Component, Modal, ComponentInstance, Colon, Identifier } from './screen-overlay.tokens';
import { Row, Col, Grid, Container } from './layout.tokens';
import { 
  AdvancedListItem, 
  List, 
  Card, 
  Header, 
  Navigator, 
  Drawer, 
  OrderedListItem, 
  UnorderedListItem, 
  FAB, 
  Separator, 
  EmptyDiv 
} from './structural.tokens';
import { Input, RadioOption, Checkbox } from './input.tokens';
import { Button, Link, Image, Heading, Text, Note, Quote } from './primitives.tokens';

// Export all tokens
export {
  // Whitespace & Formatting
  WhiteSpace,
  NewLine,
  BlankLine,
  
  // Screen & Overlay
  Screen,
  Component,
  Modal,
  ComponentInstance,
  Colon,
  Identifier,
  
  // Layout Primitives
  Row,
  Col,
  Grid,
  Container,
  
  // Structural Layout
  AdvancedListItem,
  List,
  Card,
  Header,
  Navigator,
  Drawer,
  OrderedListItem,
  UnorderedListItem,
  FAB,
  Separator,
  EmptyDiv,
  
  // Input & Form
  Input,
  RadioOption,
  Checkbox,
  
  // Primitive Elements
  Button,
  Link,
  Image,
  Heading,
  Text,
  Note,
  Quote
};

// All tokens array - order matters for matching precedence
export const allTokens = [
  NewLine,
  WhiteSpace,
  Screen,
  Component,
  Modal,
  ComponentInstance,
  FAB,
  Input,
  Button,
  Row,
  Col,
  Grid,
  Container,
  List,
  Card,
  Header,
  Navigator,
  Drawer,
  Separator,
  EmptyDiv,
  BlankLine,
  Text,
  Note,
  Quote,
  Heading,
  Link,
  Image,
  OrderedListItem,
  AdvancedListItem, // Most specific pattern must come first
  UnorderedListItem,
  RadioOption,
  Checkbox,
  Colon,
  Identifier
];