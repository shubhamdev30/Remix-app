# Use the standard Amazon Linux 2 base image
FROM amazonlinux:2

# Set maintainer label (though it's deprecated, it's included for completeness)
LABEL maintainer="Amazon AWS"

# Set environment variables for different versions
ENV VERSION_NODE_8=8.12.0
ENV VERSION_NODE_10=10.16.0
ENV VERSION_NODE_12=12
ENV VERSION_NODE_14=14
ENV VERSION_NODE_16=16
ENV VERSION_NODE_17=17
ENV VERSION_NODE_18=18 # Added Node.js version 18
ENV VERSION_NODE_DEFAULT=$VERSION_NODE_18 # Set the default Node version to 18
ENV VERSION_RUBY_2_4=2.4.6
ENV VERSION_RUBY_2_6=2.6.3
ENV VERSION_BUNDLER=2.0.1
ENV VERSION_RUBY_DEFAULT=$VERSION_RUBY_2_4
ENV VERSION_HUGO=0.75.1
ENV VERSION_YARN=1.22.0
ENV VERSION_AMPLIFY=6.3.1

# Set UTF-8 Environment
ENV LANGUAGE=en_US:en
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8

# Update system and install dependencies
RUN yum -y update && \
    yum -y install alsa-lib-devel autoconf automake bzip2 bison bzr cmake expect fontconfig git gcc-c++ GConf2-devel gtk2-devel gtk3-devel libnotify-devel libpng libpng-devel libffi-devel libtool libX11 libXext libxml2 libxml2-devel libXScrnSaver libxslt libxslt-devel libyaml libyaml-devel make nss-devel openssl-devel openssh-clients patch procps python3 python3-devel readline-devel sqlite-devel tar tree unzip wget which xorg-x11-server-Xvfb zip zlib zlib-devel && \
    yum clean all && rm -rf /var/cache/yum

# Install specific tools and versions
# Node.js installation using NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
    . ~/.nvm/nvm.sh && \
    nvm install $VERSION_NODE_8 && \
    nvm install $VERSION_NODE_10 && \
    nvm install $VERSION_NODE_12 && \
    nvm install $VERSION_NODE_14 && \
    nvm install $VERSION_NODE_16 && \
    nvm install $VERSION_NODE_17 && \
    nvm install $VERSION_NODE_18 && \
    nvm alias default $VERSION_NODE_DEFAULT && \
    nvm use default && \
    npm install -g yarn@$VERSION_YARN sm grunt-cli bower vuepress gatsby-cli @aws-amplify/cli@$VERSION_AMPLIFY

# Hugo installation
RUN wget https://github.com/gohugoio/hugo/releases/download/v${VERSION_HUGO}/hugo_${VERSION_HUGO}_Linux-64bit.tar.gz && \
    tar -xf hugo_${VERSION_HUGO}_Linux-64bit.tar.gz -C /usr/local/bin/ && \
    rm -rf hugo_${VERSION_HUGO}_Linux-64bit.tar.gz

# Python and Ruby setups can be added here following similar patterns

# AWS CLI installation
RUN pip3 install awscli && pip3 install aws-sam-cli

# Final environment setup
RUN echo 'export PATH=$PATH:/root/.nvm/versions/node/$VERSION_NODE_DEFAULT/bin:/usr/local/bin:$HOME/.local/bin' >> ~/.bashrc

# Set the entrypoint to bash
ENTRYPOINT ["bash", "-c"]
