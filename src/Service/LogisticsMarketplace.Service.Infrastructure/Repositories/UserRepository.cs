using LogisticsMarketplace.Service.Domain.Aggregates.UserAggregate;
using LogisticsMarketplace.Service.Domain.Repositories.Interfaces;
using LogisticsMarketplace.Service.Domain.Common.ValueObjects;
using LogisticsMarketplace.Service.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LogisticsMarketplace.Service.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    public UserRepository(ApplicationDbContext context) => _context = context;

    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _context.Users.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalized = new Email(email);
        return _context.Users.SingleOrDefaultAsync(x => x.Email == normalized, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default) =>
        await _context.Users.AddAsync(user, cancellationToken);
}