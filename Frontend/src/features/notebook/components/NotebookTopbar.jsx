import { Link } from 'react-router-dom'
import { BackIcon, FilterIcon, SortIcon } from '../../../components/ui/Icons'
import SearchInput from '../../../components/ui/SearchInput'
import { NOTEBOOK_MODAL } from '../hooks/useNotebook'

function NotebookTopbar({ notebook, onOpenModal, onSearchChange, onSearchClear, search }) {
  return (
    <header className="notebook-topbar">
      <div className="notebook-topbar__title">
        <Link aria-label="Back to dashboard" to="/dashboard" className="notebook-topbar__back">
          <BackIcon className="ui-icon" />
        </Link>
        <h1>{notebook?.title || 'Notebook Title'}</h1>
      </div>
      <div className="notebook-topbar__actions">
        <SearchInput
          ariaLabel="Search chapters"
          className="notebook-search"
          onChange={onSearchChange}
          onClear={onSearchClear}
          value={search}
        />
        <button
          aria-label="Filter chapters is not available yet"
          className="notebook-tool-button"
          disabled
          type="button"
        >
          <FilterIcon className="ui-icon" />
        </button>
        <button
          aria-label="Sort chapters is not available yet"
          className="notebook-tool-button"
          disabled
          type="button"
        >
          <SortIcon className="ui-icon" />
        </button>
        <button
          aria-label="Add chapter"
          className="notebook-tool-button notebook-tool-button--plus"
          onClick={() => onOpenModal(NOTEBOOK_MODAL.CHAPTER)}
          type="button"
        >
          +
        </button>
      </div>
    </header>
  )
}

export default NotebookTopbar
