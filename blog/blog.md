# 3 Ways to build Your Custom OpenTelemetry Collector Distro

OpenTelemetry Collector is a powerful tool for collecting and processing telemetry data. 

Usually everyone starts to use the contrib collector. The contrib collector is a pre-built version of the OpenTelemetry Collector that includes a wide range of receivers, processors, and exporters. It is a great starting point for most users, as it provides a lot of functionality out of the box. 

That is it's great benefit and it's downside. It is easy to configure and play around with, since it includes all available components. However, it does slows the collector down, since it has to load all components, even if you don't use them. For a production environment we need a more performant solution.

## Vendor specific Distros

Several vendors offer their own distributions of the OpenTelemetry Collector, which are optimized for their specific platforms and use cases. These distributions are approved by the vendors and are guaranteed to be compatible with their services and tools. But they have limited the number of components and therefor the functionality of the collector.

In one of the projects I was involved, we were transmitting the telemetry to a commercial backend that bills the amount of data in GB ingested. We wanted to use a combination of "spanmetrics" and routing connector and the "tail_sampling" processor to reduce the data, but they are not available in the AWS Distro. So we had to build our own custom OpenTelemetry Collector Distro.

## Use the OpenTelemetry Collector Builder (OCB)

The OpenTelemetry Collector Builder (OCB) is a tool that allows you to build a custom OpenTelemetry Collector distribution. It is a command-line tool that takes a configuration file as input and compiles a custom OpenTelemetry Collector binary. Here is the link to the docs: [OpenTelemetry Collector Builder](https://opentelemetry.io/docs/collector/custom-collector/)

That was the theory. But in practice, there were some serious issues.

1. I am not a Go developer and did not intend to add another toolset to my computer.
2. Heart of the OCB is the `the builder-config.yaml`. But all the examples I found were very basic and not related to production use cases.

## Containerize the OCB

To solve problem 1. you can use the OCB in a container. The OCB is available as a Docker image. This allows you to use the OCB without having to install any additional tools or dependencies on your local machine. It is well documented and you can find articles on how to do so.

## The 3 ways to create your builder-config.yaml

### Manually adding the components

I started to build the builder-config.yaml manually. I used the OCB documentation and posts that describe the process. I had to figure out all the different receivers, processors and other components I was intending to use.

Then I needed to find the go module for them and the version I intended to use. Yes the version matters. Also you define the version of the builder itself at the beginning of the file, not all components follow that version.

After several error during building and poking through the repos of the contrib and core collector, I understood that for most components the version is the beta version (for example, 0.123.0) but some components had stable versions (for example, 1.131.1).

Finally I was able to successfully build my first custom collector. That process is painful and time consuming. It will be a struggle to maintain and new engineers will have a hard time to understand the process. I would not recommend this approach for a production environment.

### Manually removing the components

While poking through the github repo, I found by accident an builder-config.yaml file that represents the official release. You can have a [look](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/cmd/otelcontribcol/builder-config.yaml) here at the file.

This file includes all the available components including their versions. You can use this file as a starting point for your own custom collector. You can remove the components you don't need and keep the ones you want to use. This is a much easier approach than building the file from scratch, but it still requires some manual work. You have to be careful to remove only the components you don't need, as removing the wrong component can make you build useless.

That approach is more reliable and easier to maintain than the first one. You can use the official release as a reference and remove the components you don't need. This will make it easier to keep your custom collector up to date with the latest changes in the official release. But it remains a manual process - and as you all know, the biggest cause of error sits in front of the screen...

### Use the ocbConfig to build the builder-config.yaml

I wanted to remove this source of error by automating the creation of a builder-config.yaml file. The thought behind the solution is this:

> Everyone tinkers around with the contrib collector. A working config.yaml for the collector is developed and tested. And it contains a reference to the needed components. Let's use this file to create a builder-config.yaml file automatically.

I created a tool called ocbConfig. It is a deno application written in Typescript. It use the latest version of the "official" builder-config.yaml file from the OpenTelemetry Collector contrib repo and uses the config.yaml as a filter. The result will be a custom collector builder-config.yaml file that contains only the components you need. The tool is available on [GitHub](https://github.com/Meider4cloud/ocbConfig).

The ocbConfig will use the config.yaml placed in a folder called `config`. It will parse the file, download the official builder-config.yaml and filter all unused components. The result will be a builder-config.yaml file in the same folder. You can use this file to build your custom OpenTelemetry Collector distribution using the OCB. The tool is designed to be easy to use and flexible, allowing you to customize the collector to meet your specific needs. You have the chance to check or modify the file according to your needs.

I have added a Dockerfile and compose file to the project. You can use them to build and run ocbConfig. You can use this setup to run the ocbConfig tool in a containerized environment, without having to install any additional tools or dependencies on your local machine. It also works great in your CI/CD pipeline and you can use it to build your custom OpenTelemetry Collector distribution automatically.

## Conclusion

The ocbConfig tool simplifies the process of creating a custom fit OpenTelemetry Collector distribution by automating the creation of the builder-config.yaml file. It can be included in your CI/CD pipeline and used to build your custom OpenTelemetry Collector distribution automatically. By this you can keep up-to-date with the latest developments of the OpenTelemetry collector without worrying about the process of creating you own Distro. 