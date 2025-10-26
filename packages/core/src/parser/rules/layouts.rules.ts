/**
 * Layout and Structure Parsing Rules
 * Defines parsing rules for layouts, lists, navigators, FABs, and other structural elements
 */

import {
  // Canonical Layouts
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
  // Structures
  List,
  Navigator,
  UnorderedListItem,
  Fab,
  Separator,
  ComponentInstance,
  Colon,
} from '../../lexer/tokens'
import { Indent, Outdent } from '../../lexer/lexer'
import type { IParser, RuleDefinitionFunction } from '../../types/parser'

/**
 * Define layout and structure parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineLayoutRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule layoutElement
   * @description Parses various layout elements, such as containers, stacks, rows, grids, and cards.
   * These elements can contain other elements.
   */
  this.RULE('layoutElement', () => {
    this.OR([
      // Containers
      { ALT: () => this.CONSUME(ContainerNarrow) },
      { ALT: () => this.CONSUME(ContainerWide) },
      { ALT: () => this.CONSUME(ContainerFull) },
      { ALT: () => this.CONSUME(Container) },
      // Stacks
      { ALT: () => this.CONSUME(StackTight) },
      { ALT: () => this.CONSUME(StackLoose) },
      { ALT: () => this.CONSUME(Stack) },
      { ALT: () => this.CONSUME(StackFlush) },
      // Rows
      { ALT: () => this.CONSUME(RowStart) },
      { ALT: () => this.CONSUME(RowCenter) },
      { ALT: () => this.CONSUME(RowBetween) },
      { ALT: () => this.CONSUME(RowEnd) },
      { ALT: () => this.CONSUME(Col) },
      // Grids
      { ALT: () => this.CONSUME(Grid2) },
      { ALT: () => this.CONSUME(Grid3) },
      { ALT: () => this.CONSUME(Grid4) },
      { ALT: () => this.CONSUME(GridAuto) },
      // Cards
      { ALT: () => this.CONSUME(CardCompact) },
      { ALT: () => this.CONSUME(CardFeature) },
      { ALT: () => this.CONSUME(Card) },
      // Special
      { ALT: () => this.CONSUME(Header) },
      { ALT: () => this.CONSUME(Sidebar) },
    ])
    this.containerWithOptionalContent()
  })

  /**
   * @rule listElement
   * @description Parses a list that is templated with a component, e.g., 'list $MyComponent:'.
   * This is used for rendering a list of items using a reusable component.
   */
  this.RULE('listElement', () => {
    this.CONSUME(List)
    this.CONSUME(ComponentInstance)
    this.OPTION(() => {
      this.CONSUME(Colon)
      this.OPTION2(() => {
        this.CONSUME(Indent)
        this.AT_LEAST_ONE(() => {
          this.CONSUME(UnorderedListItem)
        })
        this.OPTION3(() => {
          this.CONSUME(Outdent)
        })
      })
    })
  })

  /**
   * @rule navigatorElement
   * @description Parses a navigator element, which is a list-like structure for navigation.
   */
  this.RULE('navigatorElement', () => {
    this.CONSUME(Navigator)
    this.listWithOptionalContent()
  })

  /**
   * @rule fabElement
   * @description Parses a Floating Action Button (FAB) element, which can contain a list of actions.
   */
  this.RULE('fabElement', () => {
    this.CONSUME(Fab)
    this.listWithOptionalContent()
  })

  /**
   * @rule unorderedListElement
   * @description Parses a standalone unordered list item.
   */
  this.RULE('unorderedListElement', () => {
    this.CONSUME(UnorderedListItem)
  })

  /**
   * @rule separatorElement
   * @description Parses a separator element, used for visually separating content.
   */
  this.RULE('separatorElement', () => {
    this.CONSUME(Separator)
  })
}
