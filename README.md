# Fetch-Coding-Exercise-SDET
**Applicant: Carter Burzlaff**\
**Email: cburz6@gmail.com**

## Submission Feedback From Reviewer (Fetch)
- should get the browser to close after the test runs
  - ***Was not specified in the project requirements, but having a setting for this is useful. ADDED in [this commit](https://github.com/CartierCodes/Fetch-Coding-Exercise-SDET/commit/0d60b9d7a2d780836db8ae7040545a65b232d4f0)***
- should also close the operation in terminal. My terminal is still running even though the operation is done. ***| FIXED in [this commit](https://github.com/CartierCodes/Fetch-Coding-Exercise-SDET/commit/0d60b9d7a2d780836db8ae7040545a65b232d4f0)***
- should explicitly state which bar is the fake bar
  - ***Was not specified in the project requirements, but it is useful data. ADDED in [this commit](https://github.com/CartierCodes/Fetch-Coding-Exercise-SDET/commit/0d60b9d7a2d780836db8ae7040545a65b232d4f0)***
- put helper functions in a separate file ***| FIXED in [this commit](https://github.com/CartierCodes/Fetch-Coding-Exercise-SDET/commit/0d60b9d7a2d780836db8ae7040545a65b232d4f0)***
- declare constants and elements in another file ***| FIXED in [this commit](https://github.com/CartierCodes/Fetch-Coding-Exercise-SDET/commit/0d60b9d7a2d780836db8ae7040545a65b232d4f0)***
- in the readme, describe how you went about the solution (like splitting the gold bars into 3 piles, etc) ***| Updated***
## Algorithm Thought Process
**Idea 1 - Brute Force**\
The initial idea was to compare 2 bars at a time until I find one that is less. Obviously, this is highly inefficient so it was quickly scrapped\
- Worst case time complexity: O(n/2) weighings -> O(n)

**Idea 2 - Modified Binary Search**\
I thought that splitting the remaining bars into 2 even groups and weighing them against each other would be much more efficient. Essentially modified binary comparisons. If both sides were equal weight, then the odd bar out would be the fake bar. If not, then the fake bar must be in the group that weighs less, so repeat the process with that group until you find the fake bar. 
- Worst case time complexity: O(log2(n)) weighings -> O(log(n))

**Idea 3 - Modified Ternary Search**\
The previous method was very efficient, but the fact that weighing something gives 3 potential outputs (= > <) made me think that I should take advantage of all of them better. So by splitting the groups of bars into 3, and weighing 2 of those groups, the output will tell me which of those 3 groups has the fake bar. If groups 1 and 2 are equal, then group 3 has the fake bar. If group 1 or 2 is less than the other, then that group has the fake bar. Once we determine which group has the fake bar, we split that group into another 3 and repeat the comparisons until we are left with 1 bar. The last bar is the fake.
- Worst case time complexity: O(log3(n)) weighings -> O(log(n))

***Design with scalability in mind***\
The recursive function that executes the algorithm accepts a list of bars and will work regardless of input size. The program feeds in a list of bars based on what is read from the site, not a static value of 9. So it will scale accordingly if the site changes and has more or less gold bars (min 1 bar).
###### See problem statement [here](https://fetch-hiring.s3.amazonaws.com/SDET/Fetch_Coding_Exercise_SDET.pdf)

## User Preferences
- `RUN_BROWSER_HEADLESS` (default: `false`) controls whether the program is executed with a headless or headful browser
- `CLOSE_BROWSER_ON_FINISH` (default `true`) controls whether the headful browser window is closed after the program completes
## Run Instructions
1. Download and install Node.js from the website: https://nodejs.org/en/download (this installation includes npm which we also need)
2. Verify the installation of node and npm in terminal using the following commands: "node -v" and "npm -v"
3. If you do not have git installed, install it following instructions [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
4. Clone this repository using `git clone https://github.com/CartierCodes/Fetch-Coding-Exercise-SDET.git`
5. Navigate to the project folder
6. Run using the command `node findFakeBar`
7. You may see a system alert asking you about permissions, hit allow.
