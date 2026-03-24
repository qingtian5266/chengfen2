## ADDED Requirements

### Requirement: Admin MUST view a non-paginated user list
The admin system MUST provide a user management page that displays a simple user list without pagination controls.

#### Scenario: Load list on page entry
- **WHEN** an administrator opens the user management page
- **THEN** the system SHALL call `POST /users/list` with a fixed first-page request strategy
- **THEN** the system SHALL render the returned users as a plain table list
- **THEN** the system SHALL NOT render pagination controls

### Requirement: Admin MUST create and edit users with a shared modal
The admin system MUST support user creation and user editing using one shared modal form component.

#### Scenario: Create mode uses empty initial values
- **WHEN** an administrator clicks the create action
- **THEN** the system SHALL open the shared modal in create mode with empty default form values
- **THEN** submitting valid data SHALL call `POST /users/create`
- **THEN** the system SHALL show success feedback and refresh the list

#### Scenario: Edit mode reuses same modal with existing values
- **WHEN** an administrator clicks the edit action on a user row
- **THEN** the system SHALL open the same modal component in edit mode with that user's values prefilled
- **THEN** submitting valid changes SHALL call `POST /users/update` with the user `id`
- **THEN** the system SHALL show success feedback and refresh the list

#### Scenario: Invalid form is blocked in both modes
- **WHEN** an administrator submits the shared modal with missing required fields
- **THEN** the system SHALL block request submission
- **THEN** the system SHALL show validation error messages

### Requirement: Admin MUST delete users safely
The admin system MUST allow user deletion through explicit confirmation and MUST keep the visible list synchronized after deletion.

#### Scenario: Confirm delete
- **WHEN** an administrator confirms delete for a user row
- **THEN** the system SHALL call `POST /users/delete` with that user's `id`
- **THEN** the system SHALL show success feedback and refresh the list

#### Scenario: Cancel delete
- **WHEN** an administrator cancels the delete confirmation
- **THEN** the system SHALL NOT call `POST /users/delete`
- **THEN** the current list state SHALL remain unchanged

### Requirement: Admin MUST not provide user detail view
The admin system MUST NOT expose a dedicated user detail action or detail page in this change.

#### Scenario: Verify available actions
- **WHEN** an administrator views each user row
- **THEN** the available actions SHALL include edit and delete
- **THEN** the system SHALL NOT include a detail action

### Requirement: Admin MUST handle backend errors consistently
The admin system MUST provide readable error feedback for failed list/create/update/delete requests.

#### Scenario: List request fails
- **WHEN** `POST /users/list` fails due to network or server error
- **THEN** the system SHALL show a readable error message
- **THEN** the system SHALL keep the page in a recoverable state for retry

#### Scenario: Create or update returns business error
- **WHEN** create or update request returns a business error such as duplicate username
- **THEN** the system SHALL display the backend-provided error message
- **THEN** the system SHALL keep current modal form data for correction and resubmission
