using LogisticsMarketplace.Service.Application.DTOs;
using LogisticsMarketplace.Service.Application.Interfaces;
using LogisticsMarketplace.Service.Domain.Aggregates.OrganizationAggregate;
using LogisticsMarketplace.Service.Domain.Aggregates.UserAggregate;
using LogisticsMarketplace.Service.Domain.Common.Enums;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;

namespace LogisticsMarketplace.Service.Application.Services;

public sealed class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IOrganizationRepository _organizations;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IUserRepository users,
        IOrganizationRepository organizations,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _users = users;
        _organizations = organizations;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _users.GetByEmailAsync(request.Email, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        Organization? organization = null;
        if (user.OrganizationId.HasValue)
            organization = await _organizations.GetByIdAsync(user.OrganizationId.Value, cancellationToken);

        return CreateResponse(user, organization?.Type);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        if (request.Role == UserRole.Admin)
            throw new UnauthorizedAccessException("Administrator accounts cannot be self-registered.");
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            throw new ArgumentException("Password must contain at least 8 characters.", nameof(request.Password));
        if (await _users.GetByEmailAsync(request.Email, cancellationToken) is not null)
            throw new InvalidOperationException("An account with this email already exists.");

        Organization? organization = null;
        if (request.OrganizationId.HasValue)
        {
            organization = await _organizations.GetByIdAsync(request.OrganizationId.Value, cancellationToken)
                ?? throw new KeyNotFoundException($"Organization {request.OrganizationId} was not found.");
        }
        else if (request.Role != UserRole.Admin)
        {
            if (string.IsNullOrWhiteSpace(request.OrganizationName))
                throw new ArgumentException("Organization name is required for non-admin users.");
            if (string.IsNullOrWhiteSpace(request.ContactPhone))
                throw new ArgumentException("Contact phone is required for non-admin users.");

            var organizationType = string.IsNullOrWhiteSpace(request.OrganizationType)
                ? request.Role.ToString()
                : request.OrganizationType;

            organization = new Organization(
                request.OrganizationName,
                organizationType,
                new Email(request.Email),
                new PhoneNumber(request.ContactPhone));

            await _organizations.AddAsync(organization, cancellationToken);
        }

        var user = new User(
            new Email(request.Email),
            request.FullName,
            _passwordHasher.Hash(request.Password),
            request.Role,
            organization?.Id);

        await _users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return CreateResponse(user, organization?.Type);
    }

    private AuthResponseDto CreateResponse(User user, string? organizationType)
    {
        var token = _tokenService.CreateAccessToken(
            user.Id,
            user.Email.Value,
            user.FullName,
            user.Role.ToString(),
            user.OrganizationId,
            organizationType);

        return new AuthResponseDto
        {
            AccessToken = token.Value,
            ExpiresAt = token.ExpiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email.Value,
                FullName = user.FullName,
                Role = user.Role,
                OrganizationId = user.OrganizationId,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }
        };
    }
}