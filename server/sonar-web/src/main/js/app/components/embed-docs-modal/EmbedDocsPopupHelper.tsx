/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import EmbedDocsPopup from './EmbedDocsPopup';
import { SuggestionLink } from './SuggestionsProvider';
import { CurrentUser } from '../../types';
import Toggler from '../../../components/controls/Toggler';
import HelpIcon from '../../../components/icons-components/HelpIcon';

interface Props {
  currentUser: CurrentUser;
  suggestions: Array<SuggestionLink>;
  tooltip: boolean;
}
interface State {
  helpOpen: boolean;
}

export default class EmbedDocsPopupHelper extends React.PureComponent<Props, State> {
  mounted = false;
  state: State = { helpOpen: false };

  componentDidMount() {
    window.addEventListener('keypress', this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPress);
  }

  onKeyPress = (event: KeyboardEvent) => {
    const { tagName } = event.target as HTMLElement;
    const code = event.keyCode || event.which;
    const isInput = tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA';
    const isTriggerKey = code === 63;
    if (!isInput && isTriggerKey) {
      this.toggleHelp();
    }
  };

  setHelpDisplay = (helpOpen: boolean) => {
    this.setState({ helpOpen });
  };

  handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.currentTarget.blur();
    this.toggleHelp();
  };

  toggleHelp = () => {
    this.setState(state => {
      return { helpOpen: !state.helpOpen };
    });
  };

  closeHelp = () => {
    this.setState({ helpOpen: false });
  };

  render() {
    return (
      <li className="dropdown">
        <Toggler
          onRequestClose={this.closeHelp}
          open={this.state.helpOpen}
          overlay={
            <EmbedDocsPopup
              currentUser={this.props.currentUser}
              onClose={this.closeHelp}
              suggestions={this.props.suggestions}
            />
          }>
          <a className="navbar-help" href="#" onClick={this.handleClick}>
            <HelpIcon />
          </a>
        </Toggler>
      </li>
    );
  }
}
