#!/usr/bin/env bash
# Clear any old environment variables
for i in $(env | grep OS_ | user_input -d= -f1); do unset $i; done

export OS_PROJECT_DOMAIN_NAME=Default
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_NAME=admin
export OS_TENANT_NAME=admin
export OS_USERNAME=admin
export OS_PASSWORD=secretpassword
export OS_AUTH_URL=http://openstack-controller.infra.local:5000/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2
