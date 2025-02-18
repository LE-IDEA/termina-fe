# Contribution Guidelines
=====================

## Branch Structure
---------------

The project uses a multi-branch strategy to manage different aspects of the application:

### Main Branches

* **main**: Production-ready landing/waitlist page
* **app**: Production-ready main application section
* **staging**: Development branch for main (landing/waitlist)
* **staging-app**: Development branch for app (main application)

### Feature Branches

* Create feature branches from the appropriate staging branch
* Use the format: `feat/[feature-name]`
* Example: `feat/auth`, `feat/swap`

## Workflow
------------

1. **Feature Development**
   - Create feature branch from staging branch
   - Implement changes
   - Create PR to staging branch
   - Wait for review and approval

2. **Deployment**
   - Once approved, merge to staging
   - Test in staging environment
   - Merge to main/app when ready for production

## Pull Request Process
---------------------

1. **Create PR**
   - Target the appropriate staging branch
   - Include clear description of changes
   - Add relevant screenshots if UI changes
   - Reference any related issues

2. **Review**
   - Wait for code review
   - Address any comments
   - Ensure all tests pass(Where necessary)

3. **Merge**
   - Merge only after approval
   - Use descriptive merge commit messages

## Branch Merging Rules
---------------------

* Feature branches → Staging branches
* Staging branches → Main/App branches
* Never merge directly to main/app
* Always create PRs for code review

## Best Practices
--------------

* Keep feature branches focused and small
* Regularly sync with staging branches
* Use clear, descriptive branch names
* Follow the project's coding standards
