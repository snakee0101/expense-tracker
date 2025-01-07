# Base image
FROM php:8.4-cli

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    nodejs \
    npm \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www

# Install dependencies
RUN composer install
RUN npm install --legacy-peer-deps
RUN php artisan key:generate

# Expose Laravel's default port
EXPOSE 8000

# Start Laravel server
CMD ["php", "artisan", "--host=0.0.0.0", "serve", "--port=8000"],
    
