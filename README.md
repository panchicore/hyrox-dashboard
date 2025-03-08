## Data Visualization

The dashboard provides various visualization options:

### For Athletes
- Personal performance charts comparing your time against others
- Ranking position in overall and gender categories
- Completion metrics and percentage comparison with other participants
- Progress tracking through workout stations

### For Coaches
- Class performance distribution charts
- Gender-based performance comparisons
- Completion rate analysis by time slot
- Time delta visualization between consecutive rankings

## Dashboard Usage

1. **Main Dashboard View**: Shows overall performance statistics and leaderboards
2. **Participant Selection**: Select a participant name to focus on their specific metrics
3. **Time Slot Filtering**: Filter results by class time (5AM, 6AM, etc.)
4. **Gender Filtering**: View performance metrics by gender category
5. **Completion Status**: Filter by participants who completed vs. those who didn't

## Customization

### Adding New Data

To update with new Hyrox session data:

1. Edit the `lib/data.ts` file with the new participant information
2. Ensure the data structure matches the existing format
3. The dashboard will automatically update with the new information

### Styling Customization

This project uses TailwindCSS for styling. To customize the appearance:

1. Modify the `tailwind.config.js` file for theme-wide changes
2. Edit component-specific styles in their respective files

## Deployment

### Vercel Deployment

The easiest way to deploy this application is using [Vercel](https://vercel.com/):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and set up the build configuration
4. Click "Deploy"

### Other Hosting Options

You can also deploy to other platforms like Netlify, AWS Amplify, or any service that supports Next.js applications.

## About Hyrox

Hyrox is a fitness competition format that combines running with functional workouts. A typical Hyrox event consists of:

- 8 rounds of 1km running
- 8 functional workouts between the running segments

This dashboard analyzes performance data from Hyrox-style training sessions, helping athletes track their progress and coaches analyze class performance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Thanks to all the Hyrox participants for providing performance data
- Special thanks to the coaches for their insights on performance metrics

## License

This project is licensed under the MIT License - see the LICENSE file for details. 