# eSlove Debt Dashboard

React dashboard for managing debt collection cases and agents.

## Features

- Admin dashboard with case statistics
- Agent dashboard for managing assigned cases
- Case management with status tracking
- Agent assignment system
- Activity logging

## Tech Stack

- React
- React Router for navigation
- Tailwind CSS for styling
- Recharts for visualizations
- react-window for list virtualization

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the app
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Login Credentials

**Admin:**
- Email: admin@demo.com
- Password: admin

**Agent:**
- Email: agent@demo.com
- Password: agent

## Project Structure

```
src/
  components/     - React components
  context/        - Auth context
  services/       - API services (currently using mock data)
```

## TODO

- [ ] Connect to real backend API
- [ ] Add proper error handling
- [ ] Implement search functionality in activity log
- [ ] Add export feature for reports
- [ ] Write tests

## Notes

Currently using mock data. The services folder has the structure ready for API integration.

Performance optimizations added:
- Lazy loading routes
- Virtualized lists for large datasets

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## Production Link

Live Demo: [https://eslove-debt-dashboard.vercel.app](https://eslove-debt-dashboard.vercel.app)

## Demo Video

Google Drive Link: [https://drive.google.com/file/d/11w6i-nGU6cR-S0aZZEq202LaoOg5kCz8/view?usp=sharing](https://drive.google.com/file/d/11w6i-nGU6cR-S0aZZEq202LaoOg5kCz8/view?usp=sharing)
