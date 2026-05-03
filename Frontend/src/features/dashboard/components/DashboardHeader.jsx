import { Link } from 'react-router-dom'
import { FilterIcon, SortIcon } from '../../../components/ui/Icons'
import SearchInput from '../../../components/ui/SearchInput'

const typeFilterLabels = {
  all: 'All',
  folder: 'Folders',
  notebook: 'Notebooks',
}

const statusFilterLabels = {
  all: 'All tasks',
  active: 'Active',
  completed: 'Completed',
}

const sortLabels = {
  newest: 'Newest',
  az: 'A-Z',
  mostTodos: 'To-do terbanyak',
  leastTodos: 'To-do tersedikit',
}

function DashboardHeader({
  onLogout,
  onSearchChange,
  onSortModeChange,
  onStatusFilterChange,
  onTypeFilterChange,
  profile,
  search,
  sortMode,
  statusFilter,
  typeFilter,
}) {

  return (
    <header className="topbar dashboard-topbar">
      <div className="topbar__identity dashboard-topbar__identity">
        <h1>Hello, {profile?.display_name || profile?.name || 'Student'}</h1>
      </div>
      <div className="topbar__actions dashboard-topbar__actions">
        <SearchInput
          ariaLabel="Search folders, notebooks, and tasks"
          className="dashboard-search"
          onChange={onSearchChange}
          onClear={() => onSearchChange('')}
          value={search}
        />
        <div className="dashboard-menu">
          <button
            aria-haspopup="menu"
            aria-label="Open dashboard filters"
            className="dashboard-tool-button"
            type="button"
          >
            <FilterIcon className="ui-icon" />
          </button>
          <div aria-label="Dashboard filters" className="dashboard-menu__content" role="menu">
            <div className="dashboard-menu__section">
              <span>Type</span>
              {Object.entries(typeFilterLabels).map(([value, label]) => (
                <button
                  className={typeFilter === value ? 'is-active' : ''}
                  key={value}
                  onClick={() => onTypeFilterChange(value)}
                  role="menuitemradio"
                  aria-checked={typeFilter === value}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="dashboard-menu__section">
              <span>Status</span>
              {Object.entries(statusFilterLabels).map(([value, label]) => (
                <button
                  className={statusFilter === value ? 'is-active' : ''}
                  key={value}
                  onClick={() => onStatusFilterChange(value)}
                  role="menuitemradio"
                  aria-checked={statusFilter === value}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="dashboard-menu">
          <button
            aria-haspopup="menu"
            aria-label="Open dashboard sort options"
            className="dashboard-tool-button"
            type="button"
          >
            <SortIcon className="ui-icon" />
          </button>
          <div aria-label="Dashboard sort options" className="dashboard-menu__content dashboard-menu__content--compact" role="menu">
            <div className="dashboard-menu__section">
              <span>Sort</span>
              {Object.entries(sortLabels).map(([value, label]) => (
                <button
                  className={sortMode === value ? 'is-active' : ''}
                  key={value}
                  onClick={() => onSortModeChange(value)}
                  role="menuitemradio"
                  aria-checked={sortMode === value}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Link to="/settings" className="dashboard-tool-button dashboard-tool-button--text topbar__link">
          Settings
        </Link>
        <button
          className="dashboard-tool-button dashboard-tool-button--text"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
