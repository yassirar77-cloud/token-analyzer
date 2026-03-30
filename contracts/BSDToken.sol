// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BSDToken (Back Street Dogs)
 * @dev ERC20 token with reflection mechanism for platform currency
 * 10% of each transaction goes to reflections (distributed to all holders)
 */
contract BSDToken is ERC20, Ownable {
    // Reflection variables
    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal;
    uint256 private _rTotal;
    uint256 private _tFeeTotal;

    uint256 public reflectionFee = 10; // 10% reflection fee

    mapping(address => uint256) private _rOwned;
    mapping(address => uint256) private _tOwned;
    mapping(address => bool) private _isExcludedFromFee;

    event ReflectionDistributed(uint256 amount);
    event ExcludedFromFee(address account, bool excluded);

    constructor(uint256 initialSupply) ERC20("Back Street Dogs", "BSD") Ownable(msg.sender) {
        _tTotal = initialSupply * 10**decimals();
        _rTotal = (MAX - (MAX % _tTotal));

        _rOwned[msg.sender] = _rTotal;
        _isExcludedFromFee[msg.sender] = true;
        _isExcludedFromFee[address(this)] = true;

        emit Transfer(address(0), msg.sender, _tTotal);
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _executeTransfer(_msgSender(), recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _executeTransfer(sender, recipient, amount);

        uint256 currentAllowance = allowance(sender, _msgSender());
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, _msgSender(), currentAllowance - amount);

        return true;
    }

    function _executeTransfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        bool takeFee = !(_isExcludedFromFee[from] || _isExcludedFromFee[to]);

        _tokenTransfer(from, to, amount, takeFee);
    }

    function _tokenTransfer(address sender, address recipient, uint256 tAmount, bool takeFee) private {
        uint256 currentRate = _getRate();

        if (!takeFee) {
            uint256 rAmount = tAmount * currentRate;
            _rOwned[sender] -= rAmount;
            _rOwned[recipient] += rAmount;
            emit Transfer(sender, recipient, tAmount);
        } else {
            uint256 tFee = (tAmount * reflectionFee) / 100;
            uint256 tTransferAmount = tAmount - tFee;

            uint256 rAmount = tAmount * currentRate;
            uint256 rFee = tFee * currentRate;
            uint256 rTransferAmount = rAmount - rFee;

            _rOwned[sender] -= rAmount;
            _rOwned[recipient] += rTransferAmount;

            _reflectFee(rFee, tFee);
            emit Transfer(sender, recipient, tTransferAmount);
        }
    }

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal -= rFee;
        _tFeeTotal += tFee;
        emit ReflectionDistributed(tFee);
    }

    function _getRate() private view returns (uint256) {
        return _rTotal / _tTotal;
    }

    function tokenFromReflection(uint256 rAmount) public view returns (uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate = _getRate();
        return rAmount / currentRate;
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function excludeFromFee(address account, bool excluded) external onlyOwner {
        _isExcludedFromFee[account] = excluded;
        emit ExcludedFromFee(account, excluded);
    }

    function isExcludedFromFee(address account) public view returns (bool) {
        return _isExcludedFromFee[account];
    }

    function setReflectionFee(uint256 fee) external onlyOwner {
        require(fee <= 20, "Fee too high");
        reflectionFee = fee;
    }
}
