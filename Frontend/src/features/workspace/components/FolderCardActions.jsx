import ActionPopover from '../../../shared/components/ui/ActionPopover'
import { MoreIcon } from '../../../shared/components/ui/Icons'

function FolderCardActions({ folder, onDelete }) {
  return (
    <ActionPopover
      ariaLabel={`Folder actions for ${folder.title}`}
      buttonClassName="workspace-item__menu-button"
      icon={<MoreIcon className="ui-icon" />}
    >
      <div className="dashboard-menu__section workspace-item__menu-section">
        <button
          className="workspace-item__menu-danger"
          onClick={() => onDelete(folder.id)}
          role="menuitem"
          type="button"
        >
          Delete
        </button>
      </div>
    </ActionPopover>
  )
}

export default FolderCardActions
