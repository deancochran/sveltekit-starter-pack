---
title: Non Linear Number Inputs
description: When dealing with real world relationships, often times the pattern at which values occur are not linear. Rather the relationship is often times best defined by a non-linear function. For some cases in this application, I've found it worth my time and effort to research some different methods for users to input data.
author: Dean Cochran
date: '2024-5-20'
categories:
  - Changelog
published: false
slug: non-linear-number-inputs
---

When providing users a way to select interval intensity percentages, distances, and durations. I have determined a number of case scenarios that are not satisfying for the end users. This is of course just a example of some larger issues that I've seen.

## Contents

## The differences in the 3 disciplines

Swimming (Indoors) and Running are similar in the fact, that they are not as affected by the same natural elements that cyclists must deal with.

For this reason, I have made the large assumption, that when training. Users when creating interval workouts would likely know the distance of swim/run interval, but might not know the exact total time it takes to complete that interval.

> Total Interval Time = distance / (Intensity \* FTP)
>
> Ex:
> Total Time = 2km / (100% \* 4:00min/km)
>
> Total Time = 8:00min

The `time`, `distance`, and `duration` of an interval are all clearly correlated. However, with each discipline comes it's own conversions and calculations.

Notably in the application, the functional threshold pace (FTP) swimming is represented as a measure of seconds per 100m (s/100m). For running as you have already seen, it is a measure of seconds per kilometer (s/km), and lastly, the black sheep of the three, cycling is measured in watts.

> You will see that a lot of Swimming and Running calculations are similar. Since their unit of measurement is `time/distance`

## Issues with Creating Inputs FTP measurements

When selecting a FTP for cycling, you must provide a value in wattage. However, I guarantee you it won't be (trigger warning)

1. Negative
2. Greater than 500w

What this means, is that their is a inherit relationship humans have with wattage output whilst cycling. This relationship is even more apparent when looking at FTP.

The same concept applies to swimmers and runners too. Swimmers likely wil never have a 30s/100m FTP, and Runners will likely never have a FTP of 180s/km.

## A core issue for FTP values and intensities.

One of the most noteworthy issues I hope to address is a matter of capability.

As mentioned, FTP's are a 100% intensity rating of a user's capabilities for a long period of time.

> However if the duration of the interval was shortened... Obviously users will be able to achieve higher wattage values, or faster swim/run times.

This is a key concept in interval training. By overloading your self at a percentage of your FTP that is over 100%, you can expose yourself to `higher` percentages of intensity, for `shorter` durations. This is essentially a fundamental way of saying, you can avg a faster pace for 10 seconds than you can for 20 minutes.

> The takeaway here is that the intensity of a interval can be anywhere between 0 and infinity. (I just hope you don't plan on seriously running 999% of your FTP for more than 1s)

### The Issue with the app

When dealing with a single input, you must represent the value with a single value.

```ts
let value: number;
```

```html
<!-- Using svelte -->
<label>Cycling FTP</label>
<input type="number" bind:value />
```

For cycling ftp inputs, I represent this input as a value between 0 - 2000. I do this such that I won't have to make another Frontend component that would get _"lost in the abyss"_.

The issue this that I always run into UI/UX issues with this approach. If I was to make a line and make a point at where the avg ftp is for most people, the distribution would appear skewed.

> 0 --- (avg watt ftp) ----------------------------------------- 2000

This is also apparent with swimming and running, however their ftp is a measure of time/distance. So the input value is measured in `time` not `watts`

> 1 ------ (avg run s ftp) ---------------------------------------- `inf`
>
> 1 ------ (avg swim s ftp) -------------------------------------- `inf`

Did you notice anything strange about those two as well? Running and Swimming, since they are a measure of time/distance are unique in the fact that they must start at 1!

> Swimming 0s/100m is not possible, but 1s/100m is feasible for an extremely small amount of time (Same concept applies to running).

Additionally, another headache is introduce with this approach as running `inf` s/km is almost resting, but just not resting.

## Solutions that can be applied

I have thought about a few solutions that could provided a better end user experience.

To recap there are two large issues with when letting users enter in a desired intensity of swim, bike, or run ftps.

Notably we saw that using **single value inputs are typically skewed**, as well as the issues found with swimming and running represented as a measurement of `time/distance`, and not a simple `wattage` value like cycling.

### Non-Linear inputs for skewed relationships

Assuming we are inputting a cycling wattage value for a workout interval. The value can be anywhere between 0-2000 as we saw above, but we typically are not moving the slider value up past 1500w (lets be honest here...)

Since the data is naturally skewed, we could use a non-linear function to calculate a percentage of a maximum wattage. For Example, lets use the non-linear function (f(x)= 16(x-.5)^5 +.5):

> <iframe src="https://www.desmos.com/calculator/xglorxdsoc?embed" width="400" height="200" style="border: 1px solid #ccc" frameborder=0></iframe>

```ts
let x: number;
let watts: number;

const max_watts = 2000;

$: {
	// this will run every time x is updated
	watts = -Math.log(x) * max_watts;
}
```

```html
<!-- Using svelte -->
<label>Cycling Watts</label>
<input type="range" name="watts" min="0" max="1" step="0.01" bind:value="{x}" />
```
